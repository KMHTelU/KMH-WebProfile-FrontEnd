import { useState } from "react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertCircle, ArrowLeft, Loader2, MailCheck, Send } from "lucide-react";
import { AuthShell } from "../components/common/AuthShell";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { forgotPassword } from "../../lib/api/endpoints";
import { parseApiError } from "../../lib/api/client";

const schema = z.object({
  email: z.string().email("Email tidak valid"),
});
type FormValues = z.infer<typeof schema>;

export function ForgotPassword() {
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      await forgotPassword(values);
      setSent(true);
    } catch (err) {
      const parsed = parseApiError(err);
      setServerError(
        parsed.status === 429
          ? "Terlalu banyak permintaan. Coba lagi dalam satu jam."
          : parsed.message
      );
    }
  };

  return (
    <AuthShell>
      {sent ? (
        <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-sm p-6 text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
            <MailCheck size={22} className="text-emerald-600" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-neutral-900">
              Periksa email Anda
            </h1>
            <p className="text-sm text-neutral-500 mt-1.5">
              Jika <b>{getValues("email")}</b> terdaftar, tautan reset password
              telah dikirim ke sana. Tautan berlaku selama 60 menit.
            </p>
          </div>
          <Button asChild variant="outline" className="w-full">
            <Link to="/login">
              <ArrowLeft size={15} /> Kembali ke halaman masuk
            </Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-neutral-900">
              Lupa password?
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              Masukkan email akun Anda. Kami akan mengirimkan tautan untuk
              mengatur ulang password.
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

            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="nama@email.com"
                aria-invalid={!!errors.email}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
              {isSubmitting ? "Mengirim..." : "Kirim Tautan Reset"}
            </Button>

            <Link
              to="/login"
              className="flex items-center justify-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-600"
            >
              <ArrowLeft size={13} /> Kembali ke halaman masuk
            </Link>
          </form>
        </>
      )}
    </AuthShell>
  );
}
