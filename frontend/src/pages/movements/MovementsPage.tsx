import { useEffect, useState } from "react";
import type { Movement } from "../../types";
import { exportMovements, getMovements, type MovementsFilters } from "../../api/movementsApi";
import { Link } from "react-router-dom";

export default function MovementsPage() {
  const [items, setItems] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [tipo, setTipo] = useState<"" | "entrada" | "salida">("");
  const [fecha_inicio, setFechaInicio] = useState("");
  const [fecha_fin, setFechaFin] = useState("");

  const [exporting, setExporting] = useState(false);

  const load = async (filters?: MovementsFilters) => {
    try {
      setError(null);
      setLoading(true);
      const res = await getMovements(filters);
      setItems(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "No se pudo cargar movimientos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onApplyFilters = async () => {
    await load({
      tipo,
      fecha_inicio: fecha_inicio || undefined,
      fecha_fin: fecha_fin || undefined,
    });
  };

  const onClear = async () => {
    setTipo("");
    setFechaInicio("");
    setFechaFin("");
    await load();
  };

  const onExport = async () => {
    try {
      setExporting(true);
      await exportMovements({
        tipo,
        fecha_inicio: fecha_inicio || undefined,
        fecha_fin: fecha_fin || undefined,
      });
    } catch (err: any) {
      alert(err?.response?.data?.message ?? "No se pudo exportar");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">Movimientos</h1>
        <div className="flex gap-2">
          <Link to="/movements/new" className="rounded-lg border px-3 py-2 hover:bg-gray-50">
            + Registrar
          </Link>
          <button
            onClick={onExport}
            disabled={exporting}
            className="rounded-lg bg-black px-4 py-2 text-white disabled:opacity-60"
          >
            {exporting ? "Exportando..." : "Exportar reporte"}
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="rounded-xl border bg-white p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
          <div>
            <label className="text-sm">Tipo</label>
            <select
              className="mt-1 w-full rounded-lg border p-2"
              value={tipo}
              onChange={(e) => setTipo(e.target.value as any)}
            >
              <option value="">Todos</option>
              <option value="entrada">Entrada</option>
              <option value="salida">Salida</option>
            </select>
          </div>

          <div>
            <label className="text-sm">Fecha inicio</label>
            <input
              className="mt-1 w-full rounded-lg border p-2"
              type="date"
              value={fecha_inicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm">Fecha fin</label>
            <input
              className="mt-1 w-full rounded-lg border p-2"
              type="date"
              value={fecha_fin}
              onChange={(e) => setFechaFin(e.target.value)}
            />
          </div>

          <div className="flex items-end gap-2">
            <button
              onClick={onApplyFilters}
              className="w-full rounded-lg border px-3 py-2 hover:bg-gray-50"
            >
              Filtrar
            </button>
            <button
              onClick={onClear}
              className="w-full rounded-lg border px-3 py-2 hover:bg-gray-50"
            >
              Limpiar
            </button>
          </div>
        </div>
      </div>

      {loading && <div className="rounded-lg border bg-white p-4">Cargando...</div>}

      {error && (
        <div className="rounded-lg border bg-white p-4">
          <p className="text-red-700 text-sm">{error}</p>
          <button onClick={() => load()} className="mt-2 rounded-lg border px-3 py-2 text-sm">
            Reintentar
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="overflow-x-auto rounded-xl border bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                
                <th className="p-3">Producto</th>
                <th className="p-3">Tipo</th>
                <th className="p-3">Cantidad</th>
                <th className="p-3">Motivo</th>
                <th className="p-3">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td className="p-3 text-gray-600" colSpan={6}>
                    No hay movimientos.
                  </td>
                </tr>
              ) : (
                items.map((m) => (
                  <tr key={m.id} className="border-t">
                    
                    <td className="p-3">{m.product?.nombre}</td>
                    <td className="p-3">
                      <span className="rounded-full border px-2 py-1 text-xs">
                        {m.tipo}
                      </span>
                    </td>
                    <td className="p-3 font-medium">{m.cantidad}</td>
                    <td className="p-3">{m.motivo ?? "-"}</td>
                    <td className="p-3">{m.fecha}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}