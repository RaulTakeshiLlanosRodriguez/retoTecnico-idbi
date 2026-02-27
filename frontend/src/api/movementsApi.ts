import api from "./axios";
import type { Movement, ResourceCollectionResponse, ResourceResponse } from "../types";

export type MovementsFilters = {
  tipo?: "entrada" | "salida" | "";
  fecha_inicio?: string;
  fecha_fin?: string;
};

export type MovementPayload = {
  product_id: number;
  tipo: "entrada" | "salida";
  cantidad: number;
  motivo?: string | null;
};

export const getMovements = async (filters?: MovementsFilters) => {
  const res = await api.get<ResourceCollectionResponse<Movement>>("/movements", { params: filters });
  return res.data;
};

export const createMovement = async (payload: MovementPayload) => {
  const res = await api.post<ResourceResponse<Movement>>("/movements", payload);
  return res.data;
};

function getFilenameFromDisposition(disposition?: string) {
  if (!disposition) return null;
  const match = disposition.match(/filename\*=UTF-8''([^;]+)|filename="([^"]+)"/i);
  return decodeURIComponent(match?.[1] || match?.[2] || "") || null;
}

export const exportMovements = async (filters?: MovementsFilters) => {
  const res = await api.get("/movements/export", {
    params: filters,
    responseType: "blob",
  });

  const filename =
    getFilenameFromDisposition(res.headers?.["content-disposition"]) ||
    "reporte-movimientos.xlsx";

  const blob = new Blob([res.data], {
    type: res.headers?.["content-type"] || "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};