import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useUploadMedia } from "../../../lib/api/admin-hooks";
import type { Media } from "../../../lib/api/types";

/**
 * Pemilih media: unggah file → endpoint /protected/media → dapat media_id + url.
 * Dipakai untuk featured image blog, cover event, item galeri, dsb.
 *
 * `value` = url pratinjau (opsional). `onChange` menerima objek Media (berisi id)
 * atau null saat dihapus.
 */
export function MediaPicker({
  value,
  onChange,
  label = "Media",
  accept = "image/*",
}: {
  value?: string | null;
  onChange: (media: Media | null) => void;
  label?: string;
  accept?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const upload = useUploadMedia();
  const [preview, setPreview] = useState<string | null>(value ?? null);

  const handleFile = async (file: File) => {
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    try {
      const media = await upload.mutateAsync(file);
      setPreview(media.url ?? localUrl);
      onChange(media);
    } catch {
      setPreview(value ?? null);
    }
  };

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-neutral-700">{label}</div>
      <div className="flex items-center gap-3">
        <div className="relative w-24 h-24 rounded-lg border border-dashed border-neutral-300 bg-neutral-50 overflow-hidden flex items-center justify-center shrink-0">
          {upload.isPending ? (
            <Loader2 className="animate-spin text-neutral-400" size={20} />
          ) : preview ? (
            <img src={preview} alt="preview" className="w-full h-full object-cover" />
          ) : (
            <ImagePlus className="text-neutral-300" size={22} />
          )}
          {preview && !upload.isPending && (
            <button
              type="button"
              onClick={() => {
                setPreview(null);
                onChange(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
              className="absolute top-1 right-1 rounded-full bg-black/60 text-white p-0.5"
              aria-label="Hapus media"
            >
              <X size={12} />
            </button>
          )}
        </div>
        <div className="space-y-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
            disabled={upload.isPending}
          >
            {preview ? "Ganti" : "Unggah"}
          </Button>
          <p className="text-xs text-neutral-400">JPG/PNG/WebP.</p>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
    </div>
  );
}
