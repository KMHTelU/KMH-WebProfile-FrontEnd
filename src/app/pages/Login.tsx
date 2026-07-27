import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lock, LogIn } from "lucide-react";
import kmhLogo from "../../assets/KMH.png";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useAuth } from "../../lib/auth/useAuth";
import { parseApiError } from "../../lib/api/client";

const schema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(8, "Minimal 8 karakter"),
});
type FormValues = z.infer<typeof schema>;

export function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState<string | null>(null);

  const from = (location.state as { from?: string } | null)?.from || "/admin";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  if (isAuthenticated) {
    navigate(from, { replace: true });
  }

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      console.log(values);
      await login(values);
      navigate(from, { replace: true });
    } catch (err) {
      setServerError(parseApiError(err).message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-6">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <img src={kmhLogo} alt="KMH" className="w-14 h-14 object-contain mb-3" />
          <h1 className="text-xl font-semibold text-neutral-900">Admin KMH Tel-U</h1>
          <p className="text-sm text-neutral-500 mt-1">Masuk untuk mengelola konten</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 space-y-4"
        >
          {serverError && (
            <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
              <Lock size={16} className="mt-0.5 shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="admin@kmh.telkomuniversity.ac.id"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              aria-invalid={!!errors.password}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs text-red-600">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            <LogIn size={16} />
            {isSubmitting ? "Memproses..." : "Masuk"}
          </Button>

          <Link
            to="/"
            className="block text-center text-xs text-neutral-400 hover:text-neutral-600"
          >
            Kembali ke situs
          </Link>
        </form>
      </div>
    </div>
  );
}
