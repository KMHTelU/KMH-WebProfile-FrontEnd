import { useState } from "react";
import { Check, ChevronsUpDown, UserRound, X } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../components/ui/command";
import type { Member } from "../../../lib/api/types";

/**
 * Pemilih anggota dengan kotak pencarian (cmdk) — nyaman saat data anggota
 * sudah ratusan. Pencarian mencocokkan nama & NIM.
 *
 * Sengaja TANPA Popover/portal: daftar di-render inline (mengembang di dalam
 * form) sehingga bebas dari masalah pointer-events/fokus saat dipakai di
 * dalam Dialog modal Radix — kombinasi popover-dalam-dialog terbukti rapuh.
 */
export function MemberCombobox({
  members,
  value,
  onChange,
  placeholder = "Pilih anggota…",
  noneLabel,
}: {
  members: Member[];
  /** ID member terpilih, atau null bila belum/tidak ada. */
  value: string | null;
  onChange: (memberId: string | null) => void;
  placeholder?: string;
  /** Bila diisi, tampil opsi "kosongkan" (mis. "— Tidak ada —"). */
  noneLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const selected = members.find((m) => m.id === value) ?? null;

  const pick = (memberId: string | null) => {
    onChange(memberId);
    setOpen(false);
  };

  return (
    <div className="space-y-1.5">
      <Button
        type="button"
        variant="outline"
        role="combobox"
        aria-expanded={open}
        className="w-full justify-between font-normal"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="flex items-center gap-2 min-w-0">
          {selected?.photo?.url ? (
            <img
              src={selected.photo.url}
              alt=""
              className="w-5 h-5 rounded-full object-cover shrink-0"
            />
          ) : (
            <UserRound size={14} className="text-neutral-400 shrink-0" />
          )}
          {selected ? (
            <span className="truncate">{selected.name}</span>
          ) : (
            <span className="text-neutral-400 truncate">{placeholder}</span>
          )}
        </span>
        {open ? (
          <X size={14} className="opacity-50 shrink-0" />
        ) : (
          <ChevronsUpDown size={14} className="opacity-50 shrink-0" />
        )}
      </Button>

      {open && (
        <div className="rounded-md border border-neutral-200 bg-white shadow-sm overflow-hidden">
          <Command>
            <CommandInput placeholder="Cari nama atau NIM…" autoFocus />
            <CommandList className="max-h-56">
              <CommandEmpty>Anggota tidak ditemukan.</CommandEmpty>
              <CommandGroup>
                {noneLabel && (
                  <CommandItem value="__none__" onSelect={() => pick(null)}>
                    <span className="text-neutral-400">{noneLabel}</span>
                    {value === null && <Check size={14} className="ml-auto" />}
                  </CommandItem>
                )}
                {members.map((m) => (
                  <CommandItem
                    key={m.id}
                    // Teks inilah yang dicocokkan cmdk saat mengetik; id ikut
                    // disertakan agar nilai tiap item unik.
                    value={`${m.name ?? ""} ${m.nim ?? ""} ${m.id}`}
                    onSelect={() => pick(m.id)}
                  >
                    {m.photo?.url ? (
                      <img
                        src={m.photo.url}
                        alt=""
                        className="w-6 h-6 rounded-full object-cover shrink-0"
                      />
                    ) : (
                      <span className="w-6 h-6 rounded-full bg-neutral-200 shrink-0" />
                    )}
                    <span className="flex flex-col min-w-0">
                      <span className="truncate">{m.name || "—"}</span>
                      {m.nim && (
                        <span className="text-xs text-neutral-400">{m.nim}</span>
                      )}
                    </span>
                    {value === m.id && <Check size={14} className="ml-auto" />}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
}
