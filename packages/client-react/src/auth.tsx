import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useApolloClient, useQuery } from '@apollo/client';
import { ME, MeData, UserInfo } from './queries';
import { getToken, setToken } from './auth-storage';
import { shouldLogout } from './lib/auth-errors';

interface AuthContextValue {
  token: string | null;
  user: UserInfo | null;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const client = useApolloClient();
  const [token, setTokenState] = useState<string | null>(() => getToken());

  const clear = useCallback(() => {
    setToken(null);
    setTokenState(null);
  }, []);

  // `me` n'est demandé qu'avec un token ; un token refusé par le serveur (UNAUTHENTICATED) déconnecte.
  const { data, loading, error } = useQuery<MeData>(ME, { skip: !token });
  useEffect(() => {
    if (error && shouldLogout(error)) clear();
  }, [error, clear]);

  const login = useCallback(
    async (newToken: string) => {
      setToken(newToken);
      setTokenState(newToken);
      await client.resetStore(); // relance les requêtes actives avec le nouveau header
    },
    [client]
  );

  const logout = useCallback(async () => {
    clear();
    await client.resetStore();
  }, [client, clear]);

  const user = token ? data?.me ?? null : null;

  return <AuthContext.Provider value={{ token, user, loading, login, logout }}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth doit être utilisé sous AuthProvider');
  return context;
}
