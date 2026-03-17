import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin';
  avatar?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Solo credenciales de administrador
const ADMIN_CREDENTIALS = {
  email: 'admin@devotion.com',
  password: 'admin123',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Cargar usuario desde localStorage al montar
  useEffect(() => {
    const savedUser = localStorage.getItem('adminUser');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser.role === 'admin') {
          setUser(parsedUser);
        } else {
          localStorage.removeItem('adminUser');
        }
      } catch (e) {
        localStorage.removeItem('adminUser');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));

    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      const adminUser: User = {
        id: '1',
        email: ADMIN_CREDENTIALS.email,
        name: 'Administrador DEVOTION',
        role: 'admin',
        avatar: `https://ui-avatars.com/api/?name=Admin&background=3B82F6&color=fff`,
        createdAt: new Date().toISOString(),
      };

      setUser(adminUser);
      localStorage.setItem('adminUser', JSON.stringify(adminUser));
      return { success: true };
    }

    return { success: false, error: 'Credenciales de administrador inválidas' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('adminUser');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
