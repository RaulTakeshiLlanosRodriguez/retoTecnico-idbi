import api from "./axios";
import type {
  LoginCredentials,
  RegisterCredentials,
  LoginResponse,
  RegisterResponse,
  UserMeResponse,
  MessageResponse,
} from "../types";

export const login = async (credentials: LoginCredentials) => {
  const res = await api.post<LoginResponse>("/login", credentials);
  return res.data;
};

export const register = async (credentials: RegisterCredentials) => {
  const res = await api.post<RegisterResponse>("/register", credentials);
  return res.data;
};

export const me = async () => {
  const res = await api.get<UserMeResponse>("/user");
  return res.data;
};

export const logout = async () => {
  const res = await api.post<MessageResponse>("/logout");
  return res.data;
};