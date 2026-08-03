import { useMemo, useRef, useState } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import {
  Bold,
  Code,
  Eye,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Loader2,
  Pencil,
  Quote,
  Strikethrough,
} from "lucide-react";
import { useUploadMedia } from "../../../lib/api/admin-hooks";

/** Kelas styling sama dengan artikel publik (BlogDetail) agar preview identik. */
const PROSE_CLASSES = `max-w-none text-neutral-700 leading-relaxed
  [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mt-8 [&_h1]:mb-4 [&_h1]:text-neutral-900
  [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-neutral-900
  [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-neutral-900
  [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4
  [&_li]:mb-1 [&_a]:text-amber-700 [&_a]:underline
  [&_blockquote]:border-l-4 [&_blockquote]:border-amber-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-neutral-500
  [&_img]:rounded-xl [&_img]:my-6 [&_code]:bg-neutral-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm
  [&_pre]:bg-neutral-900 [&_pre]:text-neutral-100 [&_pre]:p-4 [&_pre]:rounded-xl [&_pre]:overflow-x-auto [&_pre]:my-6`;

function ToolbarButton({
  icon: Icon,
  title,
  onClick,
  disabled,
}: {
  icon: typeof Bold;
  title: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      disabled={disabled}
      // onMouseDown preventDefault agar seleksi di textarea tidak hilang saat tombol diklik
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className="p-1.5 rounded text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/70 disabled:opacity-40 disabled:pointer-events-none transition-colors"
    >
      <Icon size={16} />
    </button>
  );
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const [tab, setTab] = useState<"write" | "preview">("write");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const upload = useUploadMedia();

  /** Terapkan teks baru lalu pulihkan fokus + seleksi setelah re-render. */
  const applyEdit = (next: string, selStart: number, selEnd: number) => {
    onChange(next);
    requestAnimationFrame(() => {
      const ta = textareaRef.current;
      if (!ta) return;
      ta.focus();
      ta.setSelectionRange(selStart, selEnd);
    });
  };

  /** Bungkus seleksi dengan penanda (bold/italic/dll). Tanpa seleksi: sisipkan placeholder terseleksi. */
  const wrapSelection = (before: string, after: string, placeholder: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const { selectionStart: start, selectionEnd: end } = ta;
    const selected = value.slice(start, end) || placeholder;
    const next = value.slice(0, start) + before + selected + after + value.slice(end);
    applyEdit(next, start + before.length, start + before.length + selected.length);
  };

  /** Tambahkan prefix di tiap baris yang terkena seleksi (list, kutipan, heading). */
  const prefixLines = (
    prefix: string | ((lineIndex: number) => string),
    { replaceHeading = false } = {}
  ) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const { selectionStart: start, selectionEnd: end } = ta;
    const lineStart = value.lastIndexOf("\n", start - 1) + 1;
    const lineEndIdx = value.indexOf("\n", end);
    const lineEnd = lineEndIdx === -1 ? value.length : lineEndIdx;
    const block = value.slice(lineStart, lineEnd);
    const newBlock = block
      .split("\n")
      .map((line, i) => {
        const p = typeof prefix === "function" ? prefix(i) : prefix;
        const base = replaceHeading ? line.replace(/^#{1,6}\s+/, "") : line;
        return base.startsWith(p) ? base : p + base;
      })
      .join("\n");
    const next = value.slice(0, lineStart) + newBlock + value.slice(lineEnd);
    applyEdit(next, lineStart, lineStart + newBlock.length);
  };

  const insertLink = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    const { selectionStart: start, selectionEnd: end } = ta;
    const selected = value.slice(start, end) || "teks tautan";
    const snippet = `[${selected}](url)`;
    const next = value.slice(0, start) + snippet + value.slice(end);
    // Seleksikan bagian "url" agar user langsung bisa mengetik alamatnya
    const urlStart = start + selected.length + 3;
    applyEdit(next, urlStart, urlStart + 3);
  };

  const insertImage = async (file: File) => {
    const media = await upload.mutateAsync(file);
    if (!media.url) return;
    const ta = textareaRef.current;
    const pos = ta ? ta.selectionStart : value.length;
    const alt = file.name.replace(/\.[^.]+$/, "");
    const needsNewlineBefore = pos > 0 && value[pos - 1] !== "\n";
    const snippet = `${needsNewlineBefore ? "\n" : ""}![${alt}](${media.url})\n`;
    const next = value.slice(0, pos) + snippet + value.slice(pos);
    applyEdit(next, pos + snippet.length, pos + snippet.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!(e.ctrlKey || e.metaKey)) return;
    if (e.key === "b") {
      e.preventDefault();
      wrapSelection("**", "**", "teks tebal");
    } else if (e.key === "i") {
      e.preventDefault();
      wrapSelection("*", "*", "teks miring");
    }
  };

  const previewHtml = useMemo(() => {
    if (tab !== "preview" || !value) return "";
    const raw = marked.parse(value, { async: false }) as string;
    return DOMPurify.sanitize(raw);
  }, [tab, value]);

  const isWrite = tab === "write";

  return (
    <div className="rounded-md border border-input overflow-hidden bg-input-background">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2 px-2 py-1.5 bg-neutral-50 border-b border-neutral-200">
        <div className="flex items-center flex-wrap">
          <ToolbarButton icon={Heading2} title="Judul besar (H2)" disabled={!isWrite} onClick={() => prefixLines("## ", { replaceHeading: true })} />
          <ToolbarButton icon={Heading3} title="Sub-judul (H3)" disabled={!isWrite} onClick={() => prefixLines("### ", { replaceHeading: true })} />
          <div className="w-px h-4 bg-neutral-200 mx-1" />
          <ToolbarButton icon={Bold} title="Tebal (Ctrl+B)" disabled={!isWrite} onClick={() => wrapSelection("**", "**", "teks tebal")} />
          <ToolbarButton icon={Italic} title="Miring (Ctrl+I)" disabled={!isWrite} onClick={() => wrapSelection("*", "*", "teks miring")} />
          <ToolbarButton icon={Strikethrough} title="Coret" disabled={!isWrite} onClick={() => wrapSelection("~~", "~~", "teks coret")} />
          <div className="w-px h-4 bg-neutral-200 mx-1" />
          <ToolbarButton icon={List} title="Daftar poin" disabled={!isWrite} onClick={() => prefixLines("- ")} />
          <ToolbarButton icon={ListOrdered} title="Daftar bernomor" disabled={!isWrite} onClick={() => prefixLines((i) => `${i + 1}. `)} />
          <ToolbarButton icon={Quote} title="Kutipan" disabled={!isWrite} onClick={() => prefixLines("> ")} />
          <ToolbarButton icon={Code} title="Kode" disabled={!isWrite} onClick={() => wrapSelection("`", "`", "kode")} />
          <div className="w-px h-4 bg-neutral-200 mx-1" />
          <ToolbarButton icon={Link2} title="Tautan" disabled={!isWrite} onClick={insertLink} />
          <ToolbarButton
            icon={upload.isPending ? Loader2 : ImagePlus}
            title="Sisipkan gambar"
            disabled={!isWrite || upload.isPending}
            onClick={() => fileRef.current?.click()}
          />
        </div>
        {/* Tab Tulis / Preview */}
        <div className="flex items-center gap-0.5 shrink-0">
          {(
            [
              { key: "write", label: "Tulis", icon: Pencil },
              { key: "preview", label: "Preview", icon: Eye },
            ] as const
          ).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                tab === key
                  ? "bg-white text-neutral-900 shadow-sm border border-neutral-200"
                  : "text-neutral-500 hover:text-neutral-800"
              }`}
            >
              <Icon size={13} /> {label}
            </button>
          ))}
        </div>
      </div>

      {isWrite ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="block w-full min-h-[280px] px-3 py-2 font-mono text-sm bg-transparent outline-none resize-y placeholder:text-muted-foreground"
        />
      ) : (
        <div className="min-h-[280px] px-4 py-3 bg-white">
          {value ? (
            <div className={PROSE_CLASSES} dangerouslySetInnerHTML={{ __html: previewHtml }} />
          ) : (
            <p className="text-sm text-neutral-400">Belum ada konten untuk dipratinjau.</p>
          )}
        </div>
      )}

      {upload.isPending && (
        <div className="px-3 py-1.5 text-xs text-neutral-500 bg-neutral-50 border-t border-neutral-200 flex items-center gap-1.5">
          <Loader2 size={12} className="animate-spin" /> Mengunggah gambar…
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) insertImage(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
