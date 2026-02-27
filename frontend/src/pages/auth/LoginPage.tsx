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
            <input
              className="mt-1 w-full rounded-lg border p-2"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            {passwordErr && (
              <p className="mt-1 text-xs text-red-600">{passwordErr}</p>
            )}
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