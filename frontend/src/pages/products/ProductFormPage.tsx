import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createProduct, getProduct, updateProduct } from "../../api/productsApi";
import type { ValidationError } from "../../types";

type Props = { mode: "create" | "edit" };

function fieldError(err: any, field: string) {
  const data = err?.response?.data as ValidationError | undefined;
  return data?.errors?.[field]?.[0] ?? null;
}

export default function ProductFormPage({ mode }: Props) {
  const nav = useNavigate();
  const { id } = useParams();
  const productId = useMemo(() => (id ? Number(id) : null), [id]);

  const [nombre, setNombre] = useState("");
  const [sku, setSku] = useState("");

  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);

  const [formError, setFormError] = useState<string | null>(null);
  const [nombreErr, setNombreErr] = useState<string | null>(null);
  const [skuErr, setSkuErr] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (mode !== "edit" || !productId) return;
      try {
        setLoading(true);
        const res = await getProduct(productId); // { data: Product }
        setNombre(res.data.nombre);
        setSku(res.data.sku);
      } catch (err: any) {
        setFormError(err?.response?.data?.message ?? "No se pudo cargar el producto");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [mode, productId]);

  const validateClient = () => {
    setNombreErr(null);
    setSkuErr(null);
    setFormError(null);

    if (!nombre.trim()) setNombreErr("Nombre es obligatorio");
    if (!sku.trim()) setSkuErr("SKU es obligatorio");

    return Boolean(nombre.trim() && sku.trim());
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateClient()) return;

    try {
      setSaving(true);
      setFormError(null);

      if (mode === "create") {
        await createProduct({ nombre, sku });
      } else {
        if (!productId) throw new Error("ID inválido");
        await updateProduct(productId, { nombre, sku });
      }

      nav("/products");
    } catch (err: any) {
      // Errores 422 Laravel
      const nErr = fieldError(err, "nombre");
      const sErr = fieldError(err, "sku");
      if (nErr) setNombreErr(nErr);
      if (sErr) setSkuErr(sErr);

      // Otros
      if (!nErr && !sErr) {
        setFormError(err?.response?.data?.message ?? "No se pudo guardar");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="rounded-lg border bg-white p-4">Cargando...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">
          {mode === "create" ? "Nuevo producto" : "Editar producto"}
        </h1>
        <Link to="/products" className="rounded-lg border px-3 py-2 hover:bg-gray-50">
          Volver
        </Link>
      </div>

      <div className="rounded-xl border bg-white p-6">
        {formError && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {formError}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm">Nombre</label>
            <input
              className="mt-1 w-full rounded-lg border p-2"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            {nombreErr && <p className="mt-1 text-xs text-red-600">{nombreErr}</p>}
          </div>

          <div>
            <label className="text-sm">SKU</label>
            <input
              className="mt-1 w-full rounded-lg border p-2"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
            />
            {skuErr && <p className="mt-1 text-xs text-red-600">{skuErr}</p>}
          </div>

          <button
            disabled={saving}
            className="rounded-lg bg-black px-4 py-2 text-white disabled:opacity-60"
          >
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </form>
      </div>
    </div>
  );
}