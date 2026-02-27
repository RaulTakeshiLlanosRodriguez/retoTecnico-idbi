import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Product } from "../../types";
import { deleteProduct, getProducts } from "../../api/productsApi";
import ConfirmModal from "../../components/ConfirmModal";

export default function ProductsPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const load = async () => {
    try {
      setError(null);
      setLoading(true);
      const res = await getProducts();
      setItems(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "No se pudo cargar productos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setConfirmOpen(true);
  };

  const onConfirmDelete = async () => {
    if (!productToDelete) return;
    setConfirmOpen(false);
    try {
      setDeletingId(productToDelete.id);
      await deleteProduct(productToDelete.id);
      setItems((prev) => prev.filter((p) => p.id !== productToDelete.id));
    } catch (err: any) {
    } finally {
      setDeletingId(null);
      setProductToDelete(null);
    }
  };


  return (
    <>
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">Productos</h1>
        <Link
          to="/products/new"
          className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-gray-700 transition-colors"
        >
          Nuevo
        </Link>
      </div>

      {loading && <div className="rounded-lg border bg-white p-4">Cargando...</div>}

      {error && (
        <div className="rounded-lg border bg-white p-4">
          <p className="text-red-700 text-sm">{error}</p>
          <button onClick={load} className="mt-2 rounded-lg border px-3 py-2 text-sm">
            Reintentar
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="overflow-x-auto rounded-xl border bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="p-3">Nombre</th>
                <th className="p-3">SKU</th>
                <th className="p-3">Stock</th>
                <th className="p-3 w-44">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td className="p-3 text-gray-600" colSpan={4}>
                    No hay productos.
                  </td>
                </tr>
              ) : (
                items.map((p) => (
                  <tr key={p.id} className="border-t">
                    <td className="p-3">{p.nombre}</td>
                    <td className="p-3">{p.sku}</td>
                    <td className="p-3 font-medium">{p.stock_actual}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Link
                          to={`/products/${p.id}/edit`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
                        >
                          Editar
                        </Link>
                        <button
                          onClick={() => onDeleteClick(p)}
                          disabled={deletingId === p.id}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 shadow-sm hover:bg-red-50 transition-colors disabled:opacity-50"
                        >
                          {deletingId === p.id ? "Eliminando..." : "Eliminar"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
    <ConfirmModal
        open={confirmOpen}
        title="Eliminar producto"
        message={`¿Estás seguro de que deseas eliminar "${productToDelete?.nombre}"? Esta acción no se puede deshacer.`}
        confirmLabel="Sí, eliminar"
        cancelLabel="Cancelar"
        variant="danger"
        onConfirm={onConfirmDelete}
        onCancel={() => { setConfirmOpen(false); setProductToDelete(null); }}
      />
      </>
  );
}