export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Product {
  id: number;
  nombre: string;
  sku: string;
  stock_actual: number;
}

export interface Movement {
  id: number;
  tipo: "entrada" | "salida";
  cantidad: number;
  motivo: string | null;
  fecha: string;
  product: {
    id: number;
    nombre: string;
    stock_actual: number;
  };
}

export type ResourceResponse<T> = { data: T };
export type ResourceCollectionResponse<T> = { data: T[] };


export type LoginResponse = {
  user: ResourceResponse<User>;
  access_token: string;
  message: string;
};

export type RegisterResponse = ResourceResponse<User>;

export type UserMeResponse = {
  user: ResourceResponse<User>;
  access_token: string;
};

export type MessageResponse = { message: string };

export interface LoginCredentials {
  email: string;
  password: string;
}
export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export type ValidationError = {
  message: string;
  errors: Record<string, string[]>;
};