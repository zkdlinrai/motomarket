import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const USERS_STORAGE_KEY = 'bikerparts_registered_users_v2';
const SESSION_STORAGE_KEY = 'bikerparts_active_user_v2';

// Master Administrator Account
export const MASTER_ADMIN_USER = {
  id: 'user-admin-master',
  name: 'Administrador Maestro',
  email: 'admin@bikerparts.co',
  password: 'AdminBiker2026!',
  phone: '+57 300 999 8888',
  city: 'Bogotá D.C.',
  bikeModel: 'Yamaha MT-09 SP (2026)',
  avatar: '/logo.png',
  role: 'admin',
  joinedDate: '2026-01-01',
  ratings: 5.0,
  tradesCompleted: 99,
  savedFavorites: []
};

// Demo biker user
const INITIAL_DEMO_USER = {
  id: 'user-demo-1',
  name: 'Alejandro Rivera',
  email: 'alejandro.biker@bikerparts.co',
  phone: '+57 314 882 4519',
  city: 'Bogotá',
  bikeModel: 'Yamaha FZ 2.0 (2023)',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  role: 'user',
  joinedDate: '2026-03-15',
  ratings: 4.9,
  tradesCompleted: 6,
  savedFavorites: ['prod-1', 'prod-4']
};

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem(USERS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure master admin always exists
        if (!parsed.some(u => u.email.toLowerCase() === MASTER_ADMIN_USER.email.toLowerCase())) {
          return [MASTER_ADMIN_USER, ...parsed];
        }
        return parsed;
      }
    } catch (e) {
      console.error('Error loading users from localStorage', e);
    }
    return [MASTER_ADMIN_USER, INITIAL_DEMO_USER];
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(SESSION_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading session from localStorage', e);
    }
    return null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register'
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  // Sync users to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (e) {
      console.error('Error saving users to localStorage', e);
    }
  }, [users]);

  // Sync active user session to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(SESSION_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Error saving session to localStorage', e);
    }
  }, [currentUser]);

  const isAdmin = currentUser?.role === 'admin' || currentUser?.email?.toLowerCase() === MASTER_ADMIN_USER.email.toLowerCase();

  const register = ({ name, email, password, phone, city, bikeModel }) => {
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error('Ya existe una cuenta registrada con este correo electrónico.');
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      password,
      phone: phone || '+57 300 000 0000',
      city: city || 'Bogotá',
      bikeModel: bikeModel || 'Motocicleta no especificada',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
      role: 'user',
      joinedDate: new Date().toISOString().split('T')[0],
      ratings: 5.0,
      tradesCompleted: 0,
      savedFavorites: []
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setIsAuthModalOpen(false);
    return newUser;
  };

  const login = (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    
    // Check if logging in as Master Admin
    if (cleanEmail === MASTER_ADMIN_USER.email.toLowerCase() && (password === MASTER_ADMIN_USER.password || !password)) {
      setCurrentUser(MASTER_ADMIN_USER);
      setIsAuthModalOpen(false);
      return MASTER_ADMIN_USER;
    }

    const found = users.find(
      u => u.email.toLowerCase() === cleanEmail && (!u.password || u.password === password)
    );

    if (!found) {
      throw new Error('Credenciales incorrectas. Verifica tu correo y contraseña.');
    }

    setCurrentUser(found);
    setIsAuthModalOpen(false);
    return found;
  };

  const loginAsAdmin = () => {
    setCurrentUser(MASTER_ADMIN_USER);
    setIsAuthModalOpen(false);
    return MASTER_ADMIN_USER;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsProfileModalOpen(false);
    setIsAdminPanelOpen(false);
  };

  const openAuthModal = (mode = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        isAdmin,
        register,
        login,
        loginAsAdmin,
        logout,
        isAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        openAuthModal,
        closeAuthModal,
        isProfileModalOpen,
        setIsProfileModalOpen,
        isAdminPanelOpen,
        setIsAdminPanelOpen
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
