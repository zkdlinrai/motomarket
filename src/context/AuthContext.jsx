import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const USERS_STORAGE_KEY = 'motomarket_registered_users';
const SESSION_STORAGE_KEY = 'motomarket_active_user';

// Sample demo biker user
const INITIAL_DEMO_USER = {
  id: 'user-demo-1',
  name: 'Alejandro Rivera',
  email: 'alejandro.biker@motomarket.co',
  phone: '+57 314 882 4519',
  city: 'Bogotá',
  bikeModel: 'Yamaha FZ 2.0 (2023)',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  joinedDate: '2026-03-15',
  ratings: 4.9,
  tradesCompleted: 6,
  savedFavorites: ['prod-1', 'prod-4']
};

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem(USERS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading users from localStorage', e);
    }
    return [INITIAL_DEMO_USER];
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(SESSION_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading session from localStorage', e);
    }
    return null; // Not logged in by default or can be logged in
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register'
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

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

  const register = ({ name, email, password, phone, city, bikeModel }) => {
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error('Ya existe una cuenta registrada con este correo electrónico.');
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      password, // En una app real se encriptaría con bcrypt
      phone: phone || '+57 300 000 0000',
      city: city || 'Bogotá',
      bikeModel: bikeModel || 'Motocicleta no especificada',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
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
    const found = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && (!u.password || u.password === password)
    );

    if (!found) {
      throw new Error('Credenciales incorrectas. Verifica tu correo y contraseña.');
    }

    setCurrentUser(found);
    setIsAuthModalOpen(false);
    return found;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsProfileModalOpen(false);
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
        register,
        login,
        logout,
        isAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        openAuthModal,
        closeAuthModal,
        isProfileModalOpen,
        setIsProfileModalOpen
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
