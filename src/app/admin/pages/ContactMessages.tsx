import { useState } from "react";
import { Check, Eye, Trash2 } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { DataTable, type Column } from "../components/DataTable";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  useContactMessages,
  useDeleteContactMessage,
  useMarkContactMessageRead,
} from "../../../lib/api/admin-hooks";
import type { ContactMessage } from "../../../lib/api/types";

export function AdminContactMessages() {
  const { data: messages = [], isLoading } = useContactMessages({ limit: 200 });
  const markRead = useMarkContactMessageRead();
  const deleteM = useDeleteContactMessage();

  const [viewing, setViewing] = useState<ContactMessage | null>(null);
  const [toDelete, setToDelete] = useState<ContactMessage | null>(null);

  const openView = (m: ContactMessage) => {
    setViewing(m);
    if (!m.isRead) markRead.mutate(m.id);
  };

  const columns: Column<ContactMessage>[] = [
    {
      key: "isRead",
      header: "",
      className: "w-8",
      cell: (m) => (!m.isRead ? <span className="block w-2 h-2 rounded-full bg-amber-500" /> : null),
    },
    { key: "name", header: "Nama", cell: (m) => m.name || "—" },
    { key: "email", header: "Email", cell: (m) => m.email || "—" },
    { key: "subject", header: "Subjek", cell: (m) => m.subject || "—" },
    {
      key: "createdAt",
      header: "Tanggal",
      cell: (m) => (m.createdAt ? new Date(m.createdAt).toLocaleDateString("id-ID") : "—"),
    },
    {
      key: "actions",
      header: "",
      className: "text-right w-24",
      cell: (m) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" onClick={() => openView(m)}>
            <Eye size={15} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setToDelete(m)}>
            <Trash2 size={15} className="text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Pesan Kontak" description="Pesan masuk dari form kontak/join" />
      <DataTable
        columns={columns}
        rows={messages}
        isLoading={isLoading}
        emptyText="Belum ada pesan."
        rowKey={(m) => m.id}
      />

      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {viewing?.subject || "Pesan"}
              {viewing?.isRead && (
                <Badge variant="secondary" className="gap-1">
                  <Check size={12} /> Dibaca
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          {viewing && (
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-neutral-400">Dari</span>
                <div className="text-neutral-800">
                  {viewing.name} &lt;{viewing.email}&gt;
                </div>
              </div>
              <div>
                <span className="text-neutral-400">Pesan</span>
                <p className="text-neutral-800 whitespace-pre-wrap mt-1">{viewing.message}</p>
              </div>
              {viewing.createdAt && (
                <div className="text-xs text-neutral-400">
                  {new Date(viewing.createdAt).toLocaleString("id-ID")}
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            {viewing?.email && (
              <a
                href={`mailto:${viewing.email}?subject=Re: ${encodeURIComponent(viewing.subject || "")}`}
                className="inline-flex"
              >
                <Button variant="outline">Balas via Email</Button>
              </a>
            )}
            <Button onClick={() => setViewing(null)}>Tutup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        loading={deleteM.isPending}
        onConfirm={async () => {
          if (toDelete) await deleteM.mutateAsync(toDelete.id);
          setToDelete(null);
        }}
      />
    </div>
  );
}
