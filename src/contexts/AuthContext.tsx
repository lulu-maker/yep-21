import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getCurrentUser, login, patchUser, register } from '../api/authApi';
import { normalizeEmail } from '../utils/validation';
import type { LoginRequest, RegisterRequest, SessionUser } from '../types/auth';

const SESSION_KEY = 'yep21.session';

interface AuthContextValue {
  user: SessionUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isBootstrapping: boolean;
  registerUser: (payload: RegisterRequest) => Promise<SessionUser>;
  loginUser: (payload: LoginRequest) => Promise<SessionUser>;
  logout: () => void;
  updateUser: (user: SessionUser) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem(SESSION_KEY);

    if (!raw) {
      setIsBootstrapping(false);
      return;
    }

    const parsed = JSON.parse(raw) as { userId: string; accessToken: string; refreshToken: string };

    void (async () => {
      const currentUser = await getCurrentUser(parsed.userId);

      if (!currentUser) {
        localStorage.removeItem(SESSION_KEY);
        setIsBootstrapping(false);
        return;
      }

      setUser(currentUser);
      setAccessToken(parsed.accessToken);
      setRefreshToken(parsed.refreshToken);
      setIsBootstrapping(false);
    })();
  }, []);

  const persistSession = (nextUser: SessionUser, nextAccessToken: string, nextRefreshToken: string) => {
    setUser(nextUser);
    setAccessToken(nextAccessToken);
    setRefreshToken(nextRefreshToken);
    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ userId: nextUser.id, accessToken: nextAccessToken, refreshToken: nextRefreshToken }),
    );
  };

  const registerUser = async (payload: RegisterRequest) => {
    const response = await register({ ...payload, email: normalizeEmail(payload.email) });
    persistSession(response.user, response.accessToken, response.refreshToken);
    return response.user;
  };

  const loginUser = async (payload: LoginRequest) => {
    const response = await login({ ...payload, email: normalizeEmail(payload.email) });
    persistSession(response.user, response.accessToken, response.refreshToken);
    return response.user;
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem(SESSION_KEY);
  };

  const updateUser = (nextUser: SessionUser) => {
    setUser(nextUser);
    patchUser(nextUser);
  };

  const value = useMemo<AuthContextValue>(
    () => ({ user, accessToken, refreshToken, isBootstrapping, registerUser, loginUser, logout, updateUser }),
    [user, accessToken, refreshToken, isBootstrapping],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
