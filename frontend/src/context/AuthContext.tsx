import React, { createContext, useEffect, useMemo, useState } from "react";
import type { User, LoginCredentials, RegisterCredentials } from "../types";
import { login as loginApi, register as registerApi, logout as logoutApi, me as meApi } from "../api/authApi";

type AuthState = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (c: LoginCredentials) => Promise<void>;
  register: (c: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  const hydrate = async () => {
    try {
      const res = await meApi();
      setUser(res.user);
      setToken(res.access_token);
      localStorage.setItem("token", res.access_token);
    } catch {
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) hydrate();
    else setLoading(false);
  }, []);

  const login = async (c: LoginCredentials) => {
    const res = await loginApi(c); 
    localStorage.setItem("token", res.access_token);
    setToken(res.access_token);
    setUser(res.user);
  };

  const register = async (c: RegisterCredentials) => {
    await registerApi(c);
    await login({ email: c.email, password: c.password });
  };

  const logout = async () => {
    try {
      await logoutApi();
    } finally {
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
      window.location.href = "/login";
    }
  };

  const value = useMemo(() => ({ user, token, loading, login, register, logout }), [user, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};