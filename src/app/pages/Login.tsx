import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertCircle, Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { AuthShell } from "../components/common/AuthShell";
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
  const [showPassword, setShowPassword] = useState(false);

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
    return <Navigate to={from} replace />;
  }

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      await login(values);
      navigate(from, { replace: true });
    } catch (err) {
      setServerError(parseApiError(err).message);
    }
  };

  return (
    <AuthShell>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-neutral-900">
          Selamat datang kembali
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Masuk untuk mengelola konten & data KMH Tel-U.
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
            placeholder="admin@kmh.telkomuniversity.ac.id"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              to="/forgot-password"
              className="text-xs text-amber-600 hover:text-amber-700 font-medium"
            >
              Lupa password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              aria-invalid={!!errors.password}
              className="pr-10"
              {...register("password")}
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-600">{errors.password.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <LogIn size={16} />
          )}
          {isSubmitting ? "Memproses..." : "Masuk"}
        </Button>
      </form>
    </AuthShell>
  );
}
