// Global Authentication Context
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  currentUser: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, pass: string) => Promise<void>;
  register: (params: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    role: UserRole;
  }) => Promise<void>;
  verifyOtp: (tempUserId: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  switchDemoRole: (newRole: UserRole) => Promise<void>;
  allUsers: User[];
  refreshUsers: () => Promise<void>;
  toggleUserStatus: (userId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  const loadUser = async () => {
    try {
      setIsLoading(true);
      const user = await authService.getCurrentUser();
      setCurrentUser(user);
      const users = await authService.getAllUsers();
      setAllUsers(users);
    } catch {
      // fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (identifier: string, pass: string) => {
    const res = await authService.login(identifier, pass);
    setCurrentUser(res.user);
  };

  const register = async (params: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    role: UserRole;
  }) => {
    const res = await authService.register(params);
    setCurrentUser(res.user);
  };

  const verifyOtp = async (tempUserId: string, otp: string) => {
    const user = await authService.verifyOtp(tempUserId, otp);
    setCurrentUser(user);
  };

  const logout = async () => {
    await authService.logout();
    setCurrentUser(null);
  };

  const switchDemoRole = async (newRole: UserRole) => {
    const user = await authService.switchDemoRole(newRole);
    setCurrentUser(user);
  };

  const refreshUsers = async () => {
    const users = await authService.getAllUsers();
    setAllUsers(users);
  };

  const toggleUserStatus = async (userId: string) => {
    await authService.toggleUserStatus(userId);
    await refreshUsers();
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role: currentUser?.role || 'visitor',
        isAuthenticated: !!currentUser,
        isLoading,
        login,
        register,
        verifyOtp,
        logout,
        switchDemoRole,
        allUsers,
        refreshUsers,
        toggleUserStatus,
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
