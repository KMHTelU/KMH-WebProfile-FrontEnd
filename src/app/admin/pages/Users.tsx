import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { DataTable, type Column } from "../components/DataTable";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";
import { Badge } from "../../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  useCreateUser,
  useDeleteUser,
  useRoles,
  useUpdateUser,
  useUsers,
} from "../../../lib/api/admin-hooks";
import type { AppUser } from "../../../lib/api/types";

export function AdminUsers() {
  const { data: users = [], isLoading } = useUsers();
  const { data: roles = [] } = useRoles();
  const createM = useCreateUser();
  const updateM = useUpdateUser();
  const deleteM = useDeleteUser();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AppUser | null>(null);
  const [toDelete, setToDelete] = useState<AppUser | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState("");
  const [isActive, setIsActive] = useState(true);

  const openCreate = () => {
    setEditing(null);
    setName("");
    setEmail("");
    setPassword("");
    setRoleId(roles[0]?.id || "");
    setIsActive(true);
    setOpen(true);
  };
  const openEdit = (u: AppUser) => {
    setEditing(u);
    setName(u.name || "");
    setEmail(u.email || "");
    setPassword("");
    setRoleId(u.roleId || "");
    setIsActive(u.isActive);
    setOpen(true);
  };

  const submit = async () => {
    if (editing) {
      await updateM.mutateAsync({
        id: editing.id,
        payload: {
          name,
          email,
          role_id: roleId || undefined,
          is_active: isActive,
          ...(password ? { password } : {}),
        },
      });
    } else {
      await createM.mutateAsync({ name, email, password, role_id: roleId });
    }
    setOpen(false);
  };

  const columns: Column<AppUser>[] = [
    { key: "name", header: "Nama", cell: (u) => u.name || "—" },
    { key: "email", header: "Email", cell: (u) => u.email || "—" },
    { key: "role", header: "Role", cell: (u) => u.role?.name || "—" },
    {
      key: "isActive",
      header: "Status",
      cell: (u) =>
        u.isActive ? (
          <Badge className="bg-emerald-500">Aktif</Badge>
        ) : (
          <Badge variant="secondary">Nonaktif</Badge>
        ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right w-24",
      cell: (u) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" onClick={() => openEdit(u)}>
            <Pencil size={15} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setToDelete(u)}>
            <Trash2 size={15} className="text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  const valid = name && email && roleId && (editing || password.length >= 8);

  return (
    <div>
      <PageHeader
        title="Users"
        description="Akun pengurus & administrator"
        action={
          <Button onClick={openCreate}>
            <Plus size={16} /> User Baru
          </Button>
        }
      />
      <DataTable columns={columns} rows={users} isLoading={isLoading} rowKey={(u) => u.id} />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit User" : "User Baru"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Nama</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Password {editing && <span className="text-neutral-400">(kosongkan jika tidak diubah)</span>}</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="min. 8 karakter"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Select value={roleId} onValueChange={setRoleId}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {editing && (
              <div className="flex items-center justify-between">
                <Label>Aktif</Label>
                <Switch checked={isActive} onCheckedChange={setIsActive} />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button onClick={submit} disabled={!valid || createM.isPending || updateM.isPending}>
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
