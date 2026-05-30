import React, { createContext, useCallback, useContext, useState, useEffect } from "react";

export interface UserType {
  id: string;
  name: string;
  email: string;
  plan: string;
  credits: number;
}

interface AuthContextType {
  user: UserType | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: UserType) => void;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  apiBaseUrl: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from local storage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("purepixels_token");
    const savedUser = localStorage.getItem("purepixels_user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse user session", e);
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((newToken: string, newUser: UserType) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("purepixels_token", newToken);
    localStorage.setItem("purepixels_user", JSON.stringify(newUser));
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("purepixels_token");
    localStorage.removeItem("purepixels_user");
  }, []);

  const refreshProfile = useCallback(async () => {
    const currentToken = token || localStorage.getItem("purepixels_token");
    if (!currentToken) return;

    try {
      const response = await fetch(`${apiBaseUrl}/user/profile`, {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        localStorage.setItem("purepixels_user", JSON.stringify(data.user));
      } else if (response.status === 401) {
        logout(); // token expired
      }
    } catch (error) {
      console.error("Error refreshing profile status:", error);
    }
  }, [logout, token]);

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        logout,
        refreshProfile,
        apiBaseUrl,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
