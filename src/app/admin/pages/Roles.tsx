import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { DataTable, type Column } from "../components/DataTable";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  useCreateRole,
  useDeleteRole,
  useRoles,
  useUpdateRole,
} from "../../../lib/api/admin-hooks";
import type { Role } from "../../../lib/api/types";

export function AdminRoles() {
  const { data: roles = [], isLoading } = useRoles();
  const createM = useCreateRole();
  const updateM = useUpdateRole();
  const deleteM = useDeleteRole();

  const [editing, setEditing] = useState<Role | null>(null);
  const [open, setOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Role | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const openCreate = () => {
    setEditing(null);
    setName("");
    setDescription("");
    setOpen(true);
  };
  const openEdit = (r: Role) => {
    setEditing(r);
    setName(r.name || "");
    setDescription(r.description || "");
    setOpen(true);
  };

  const submit = async () => {
    const payload = { name, description: description || undefined };
    if (editing) await updateM.mutateAsync({ id: editing.id, payload });
    else await createM.mutateAsync(payload);
    setOpen(false);
  };

  const columns: Column<Role>[] = [
    { key: "name", header: "Nama", cell: (r) => r.name || "—" },
    { key: "description", header: "Deskripsi", cell: (r) => r.description || "—" },
    {
      key: "actions",
      header: "",
      className: "text-right w-24",
      cell: (r) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" onClick={() => openEdit(r)}>
            <Pencil size={15} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setToDelete(r)}>
            <Trash2 size={15} className="text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Roles"
        description="Peran & hak akses pengguna"
        action={
          <Button onClick={openCreate}>
            <Plus size={16} /> Role Baru
          </Button>
        }
      />
      <DataTable columns={columns} rows={roles} isLoading={isLoading} rowKey={(r) => r.id} />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Role" : "Role Baru"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="role-name">Nama</Label>
              <Input id="role-name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="role-desc">Deskripsi</Label>
              <Textarea
                id="role-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button onClick={submit} disabled={!name || createM.isPending || updateM.isPending}>
              Simpan
            </Button>
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
