import { useState } from "react";
import { Check, ChevronsUpDown, UserRound } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
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
 * Dropdown pemilih anggota dengan kotak pencarian (Command/cmdk) — nyaman
 * dipakai saat data anggota sudah puluhan. Pencarian mencocokkan nama & NIM.
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
    // modal={true} WAJIB karena combobox ini dipakai di dalam Dialog:
    // tanpa ini, Dialog modal mematikan pointer-events pada konten popover
    // (yang di-portal ke body, di luar dialog) sehingga dropdown tidak
    // merespons klik/ketikan sama sekali.
    <Popover modal={true} open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
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
          <ChevronsUpDown size={14} className="opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <Command>
          <CommandInput placeholder="Cari nama atau NIM…" />
          <CommandList>
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
      </PopoverContent>
    </Popover>
  );
}
