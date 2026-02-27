import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProducts } from "../../api/productsApi";
import { createMovement } from "../../api/movementsApi";
import type { ValidationError, Product } from "../../types";

function fieldError(err: any, field: string) {
  const data = err?.response?.data as ValidationError | undefined;
  return data?.errors?.[field]?.[0] ?? null;
}

export default function MovementCreatePage() {
  const nav = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [productId, setProductId] = useState<number | "">("");
  const [tipo, setTipo] = useState<"entrada" | "salida">("entrada");
  const [cantidad, setCantidad] = useState<string>("1");
  const [motivo, setMotivo] = useState<string>("");

  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [cantidadErr, setCantidadErr] = useState<string | null>(null);
  const [productErr, setProductErr] = useState<string | null>(null);

  const selected = useMemo(
    () => products.find((p) => p.id === productId),
    [products, productId]
  );

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await getProducts();
        setProducts(res.data);
      } catch (err: any) {
        setFormError(err?.response?.data?.message ?? "No se pudo cargar productos");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const validateClient = () => {
    setFormError(null);
    setCantidadErr(null);
    setProductErr(null);

    if (!productId) setProductErr("Selecciona un producto");
    const n = Number(cantidad);
    if (!Number.isFinite(n) || n <= 0) setCantidadErr("Cantidad debe ser mayor a 0");

    return Boolean(productId && Number.isFinite(n) && n > 0);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateClient()) return;

    try {
      setSaving(true);

      await createMovement({
        product_id: Number(productId),
        tipo,
        cantidad: Number(cantidad),
        motivo: motivo.trim() ? motivo.trim() : null,
      });

      // Buena UX: regresar a lista de movimientos
      nav("/movements");
    } catch (err: any) {
      const cErr = fieldError(err, "cantidad");
      const pErr = fieldError(err, "product_id");
      if (cErr) setCantidadErr(cErr);
      if (pErr) setProductErr(pErr);

      if (!cErr && !pErr) {
        setFormError(err?.response?.data?.message ?? "No se pudo registrar el movimiento");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="rounded-lg border bg-white p-4">Cargando...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">Registrar movimiento</h1>
        <Link to="/movements" className="rounded-lg border px-3 py-2 hover:bg-gray-50">
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
            <label className="text-sm">Producto</label>
            <select
              className="mt-1 w-full rounded-lg border p-2"
              value={productId}
              onChange={(e) => setProductId(e.target.value ? Number(e.target.value) : "")}
            >
              <option value="">-- Selecciona --</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre} (Stock: {p.stock_actual})
                </option>
              ))}
            </select>
            {productErr && <p className="mt-1 text-xs text-red-600">{productErr}</p>}
            {selected && (
              <p className="mt-1 text-xs text-gray-600">
                Stock actual: <span className="font-medium">{selected.stock_actual}</span>
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="text-sm">Tipo</label>
              <select
                className="mt-1 w-full rounded-lg border p-2"
                value={tipo}
                onChange={(e) => setTipo(e.target.value as any)}
              >
                <option value="entrada">Entrada</option>
                <option value="salida">Salida</option>
              </select>
            </div>

            <div>
              <label className="text-sm">Cantidad</label>
              <input
                className="mt-1 w-full rounded-lg border p-2"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                inputMode="numeric"
              />
              {cantidadErr && <p className="mt-1 text-xs text-red-600">{cantidadErr}</p>}
            </div>
          </div>

          <div>
            <label className="text-sm">Motivo (opcional)</label>
            <input
              className="mt-1 w-full rounded-lg border p-2"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Ej: Compra, Venta, Ajuste..."
            />
          </div>

          <button
            disabled={saving}
            className="rounded-lg bg-black px-4 py-2 text-white disabled:opacity-60"
          >
            {saving ? "Registrando..." : "Registrar"}
          </button>
        </form>
      </div>
    </div>
  );
}