import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import type { ValidationError } from "../../types";

function fieldError(err: any, field: string) {
  const data = err?.response?.data as ValidationError | undefined;
  return data?.errors?.[field]?.[0] ?? null;
}

export default function LoginPage() {
  const nav = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [emailErr, setEmailErr] = useState<string | null>(null);
  const [passwordErr, setPasswordErr] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const validateClient = () => {
    setFormError(null);
    setEmailErr(null);
    setPasswordErr(null);

    if (!email.trim()) setEmailErr("Email es obligatorio");
    if (!password.trim()) setPasswordErr("Password es obligatorio");

    return Boolean(email.trim() && password.trim());
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateClient()) return;

    try {
      setLoading(true);
      await login({ email, password });
      nav("/products");
    } catch (err: any) {
      // 422 (validaciones)
      const eErr = fieldError(err, "email");
      const pErr = fieldError(err, "password");
      if (eErr) setEmailErr(eErr);
      if (pErr) setPasswordErr(pErr);

      if (!eErr && !pErr) {
        setFormError(err?.response?.data?.message ?? "No se pudo iniciar sesión");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-xl border bg-white p-6 shadow">
        <h1 className="text-xl font-semibold">Iniciar sesión</h1>
        <p className="mt-1 text-sm text-gray-600">
          Ingresa con tu correo y contraseña.
        </p>

        {formError && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {formError}
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <div>
            <label className="text-sm">Email</label>
            <input
              className="mt-1 w-full rounded-lg border p-2"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            {emailErr && <p className="mt-1 text-xs text-red-600">{emailErr}</p>}
          </div>

          <div>
            <label className="text-sm">Password</label>
            <div className="relative mt-1">
              <input
              className="mt-1 w-full rounded-lg border p-2"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.94 10.94 0 0112 20c-5 0-9-4-10-8a11.05 11.05 0 012.53-4.36" />
                    <path d="M1 1l22 22" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            {passwordErr && (
              <p className="mt-1 text-xs text-red-600">{passwordErr}</p>
            )}
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full rounded-lg bg-black px-4 py-2 text-white disabled:opacity-60"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-700">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="font-medium underline">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}