import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
} from "lucide-react";
import { AuthShell } from "../components/common/AuthShell";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { resetPassword } from "../../lib/api/endpoints";
import { parseApiError } from "../../lib/api/client";

const schema = z
  .object({
    password: z.string().min(8, "Minimal 8 karakter"),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, {
    message: "Password tidak sama",
    path: ["confirm"],
  });
type FormValues = z.infer<typeof schema>;

function PasswordField({
  id,
  label,
  error,
  inputProps,
}: {
  id: string;
  label: string;
  error?: string;
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={show ? "text" : "password"}
          autoComplete="new-password"
          className="pr-10"
          aria-invalid={!!error}
          {...inputProps}
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
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirm: "" },
  });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      await resetPassword({ token, new_password: values.password });
      setDone(true);
    } catch (err) {
      setServerError(parseApiError(err).message);
    }
  };

  if (!token) {
    return (
      <AuthShell>
        <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-sm p-6 text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
            <AlertCircle size={22} className="text-red-500" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-neutral-900">
              Tautan tidak valid
            </h1>
            <p className="text-sm text-neutral-500 mt-1.5">
              Tautan reset password tidak lengkap atau salah. Silakan minta
              tautan baru.
            </p>
          </div>
          <Button asChild className="w-full">
            <Link to="/forgot-password">Minta Tautan Baru</Link>
          </Button>
        </div>
      </AuthShell>
    );
  }

  if (done) {
    return (
      <AuthShell>
        <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-sm p-6 text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle2 size={22} className="text-emerald-600" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-neutral-900">
              Password berhasil diubah
            </h1>
            <p className="text-sm text-neutral-500 mt-1.5">
              Silakan masuk kembali menggunakan password baru Anda.
            </p>
          </div>
          <Button asChild className="w-full">
            <Link to="/login">Masuk Sekarang</Link>
          </Button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-neutral-900">
          Atur ulang password
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Buat password baru untuk akun Anda. Minimal 8 karakter.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-2xl border border-neutral-200/80 shadow-sm p-6 space-y-4"
      >
        {serverError && (
          <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        <PasswordField
          id="password"
          label="Password Baru"
          error={errors.password?.message}
          inputProps={register("password")}
        />
        <PasswordField
          id="confirm"
          label="Ulangi Password Baru"
          error={errors.confirm?.message}
          inputProps={register("confirm")}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <LockKeyhole size={16} />
          )}
          {isSubmitting ? "Menyimpan..." : "Simpan Password Baru"}
        </Button>

        <Link
          to="/login"
          className="flex items-center justify-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-600"
        >
          <ArrowLeft size={13} /> Kembali ke halaman masuk
        </Link>
      </form>
    </AuthShell>
  );
}
