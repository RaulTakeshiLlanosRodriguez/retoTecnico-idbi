import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function AppLayout() {
  const { user, logout } = useAuth();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-lg text-sm ${isActive ? "bg-black text-white" : "hover:bg-gray-100"}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between gap-3">
          <div className="font-semibold">Inventario</div>

          <nav className="flex gap-2">
            <NavLink to="/products" className={linkClass}>Productos</NavLink>
            <NavLink to="/movements" className={linkClass}>Movimientos</NavLink>
          </nav>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Hola {user?.name}</span>
            <button onClick={logout} className="text-sm rounded-lg border px-3 py-2 hover:bg-gray-100">
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-6">
        <Outlet />
      </main>
    </div>
  );
}