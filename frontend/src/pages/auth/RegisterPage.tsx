import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import type { ValidationError } from "../../types";

function fieldError(err: any, field: string) {
  const data = err?.response?.data as ValidationError | undefined;
  return data?.errors?.[field]?.[0] ?? null;
}

export default function RegisterPage() {
  const nav = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [nameErr, setNameErr] = useState<string | null>(null);
  const [emailErr, setEmailErr] = useState<string | null>(null);
  const [passwordErr, setPasswordErr] = useState<string | null>(null);

  const validateClient = () => {
    setFormError(null);
    setNameErr(null);
    setEmailErr(null);
    setPasswordErr(null);

    if (!name.trim()) setNameErr("Nombre es obligatorio");
    if (!email.trim()) setEmailErr("Email es obligatorio");
    if (password.length < 6) setPasswordErr("Password mínimo 6 caracteres");

    return Boolean(name.trim() && email.trim() && password.length >= 6);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateClient()) return;

    try {
      setLoading(true);
      // En AuthContext yo lo dejé con login automático luego de register
      await register({ name, email, password });
      nav("/products");
    } catch (err: any) {
      const nErr = fieldError(err, "name");
      const eErr = fieldError(err, "email");
      const pErr = fieldError(err, "password");

      if (nErr) setNameErr(nErr);
      if (eErr) setEmailErr(eErr);
      if (pErr) setPasswordErr(pErr);

      if (!nErr && !eErr && !pErr) {
        setFormError(err?.response?.data?.message ?? "No se pudo registrar");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-xl border bg-white p-6 shadow">
        <h1 className="text-xl font-semibold">Registro</h1>
        <p className="mt-1 text-sm text-gray-600">
          Crea tu cuenta para acceder al sistema.
        </p>

        {formError && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {formError}
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <div>
            <label className="text-sm">Nombre</label>
            <input
              className="mt-1 w-full rounded-lg border p-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
            {nameErr && <p className="mt-1 text-xs text-red-600">{nameErr}</p>}
          </div>

          <div>
            <label className="text-sm">Email</label>
            <input
              className="mt-1 w-full rounded-lg border p-2"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            {emailErr && (
              <p className="mt-1 text-xs text-red-600">{emailErr}</p>
            )}
          </div>

          <div>
            <label className="text-sm">Password</label>
            <input
              className="mt-1 w-full rounded-lg border p-2"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
            {passwordErr && (
              <p className="mt-1 text-xs text-red-600">{passwordErr}</p>
            )}
          </div>

          <button
            disabled={loading}
            className="w-full rounded-lg bg-black px-4 py-2 text-white disabled:opacity-60"
          >
            {loading ? "Creando..." : "Crear cuenta"}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-700">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="font-medium underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}