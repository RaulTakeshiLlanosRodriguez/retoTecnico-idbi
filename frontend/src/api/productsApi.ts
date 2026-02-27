import api from "./axios";
import type { Product, ResourceCollectionResponse, ResourceResponse } from "../types";

export type ProductPayload = { nombre: string; sku: string };

export const getProducts = async () => {
  const res = await api.get<ResourceCollectionResponse<Product>>("/products");
  return res.data;
};

export const getProduct = async (id: number) => {
  const res = await api.get<ResourceResponse<Product>>(`/products/${id}`);
  return res.data;
};

export const createProduct = async (payload: ProductPayload) => {
  const res = await api.post<ResourceResponse<Product>>("/products", payload);
  return res.data;
};

export const updateProduct = async (id: number, payload: ProductPayload) => {
  const res = await api.put<ResourceResponse<Product>>(`/products/${id}`, payload);
  return res.data;
};

export const deleteProduct = async (id: number) => {
  const res = await api.delete<{ message: string; data: null }>(`/products/${id}`);
  return res.data;
};