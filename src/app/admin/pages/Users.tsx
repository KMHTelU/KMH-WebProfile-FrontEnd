import { useState } from "react";
import { Clock, Pencil, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { DataTable, type Column } from "../components/DataTable";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { FieldLabel } from "../components/FieldLabel";
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

// "3 Agu 2026, 12.40" — ringkas tapi tetap lengkap tanggal & jam.
const lastLoginFmt = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "medium",
  timeStyle: "short",
});

function formatLastLogin(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : lastLoginFmt.format(d);
}

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
      key: "lastLoginAt",
      header: "Login Terakhir",
      cell: (u) => {
        const formatted = formatLastLogin(u.lastLoginAt);
        return formatted ? (
          <span className="inline-flex items-center gap-1.5 text-neutral-600">
            <Clock size={13} className="text-neutral-400" />
            {formatted}
          </span>
        ) : (
          <span className="text-neutral-400">Belum pernah login</span>
        );
      },
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
              <FieldLabel required>Nama</FieldLabel>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <FieldLabel required>Email</FieldLabel>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <FieldLabel required={!editing}>Password</FieldLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={editing ? "kosongkan jika tidak diubah" : "min. 8 karakter"}
              />
            </div>
            <div className="space-y-1.5">
              <FieldLabel required>Role</FieldLabel>
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
