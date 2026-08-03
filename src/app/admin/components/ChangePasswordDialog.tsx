import { useState } from "react";
import { Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { FieldLabel } from "./FieldLabel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { useChangePassword } from "../../../lib/api/admin-hooks";

function PasswordInput({
  id,
  value,
  onChange,
  placeholder,
  autoComplete,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input
        id={id}
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="pr-10"
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setShow((s) => !s)}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
        aria-label={show ? "Sembunyikan password" : "Tampilkan password"}
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}

/** Dialog ganti password untuk user yang sedang login. */
export function ChangePasswordDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const changeM = useChangePassword();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const mismatch = confirm.length > 0 && newPassword !== confirm;
  const valid =
    oldPassword.length >= 1 && newPassword.length >= 8 && newPassword === confirm;

  const handleOpenChange = (o: boolean) => {
    if (!o) {
      setOldPassword("");
      setNewPassword("");
      setConfirm("");
    }
    onOpenChange(o);
  };

  const submit = async () => {
    try {
      await changeM.mutateAsync({
        old_password: oldPassword,
        new_password: newPassword,
      });
      handleOpenChange(false);
    } catch {
      // Toast error sudah ditangani hook-nya; dialog tetap terbuka.
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound size={17} className="text-amber-500" /> Ganti Password
          </DialogTitle>
          <DialogDescription>
            Setelah berhasil, notifikasi akan dikirim ke email Anda.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <FieldLabel htmlFor="pwd-old" required>
              Password Lama
            </FieldLabel>
            <PasswordInput
              id="pwd-old"
              value={oldPassword}
              onChange={setOldPassword}
              autoComplete="current-password"
            />
          </div>
          <div className="space-y-1.5">
            <FieldLabel htmlFor="pwd-new" required>
              Password Baru
            </FieldLabel>
            <PasswordInput
              id="pwd-new"
              value={newPassword}
              onChange={setNewPassword}
              placeholder="min. 8 karakter"
              autoComplete="new-password"
            />
          </div>
          <div className="space-y-1.5">
            <FieldLabel htmlFor="pwd-confirm" required>
              Ulangi Password Baru
            </FieldLabel>
            <PasswordInput
              id="pwd-confirm"
              value={confirm}
              onChange={setConfirm}
              autoComplete="new-password"
            />
            {mismatch && (
              <p className="text-xs text-red-600">Password tidak sama.</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Batal
          </Button>
          <Button onClick={submit} disabled={!valid || changeM.isPending}>
            {changeM.isPending && <Loader2 size={15} className="animate-spin" />}
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
