// Authentication service with session management and demo role switcher
import { User, UserRole } from '../types';
import { MOCK_USERS } from '../data/mockData';
import { storageService } from './storageService';

const AUTH_USER_KEY = 'terraverify_auth_user';
const USERS_LIST_KEY = 'terraverify_users_list';

export const authService = {
  async initUsers(): Promise<Record<string, User>> {
    const existing = await storageService.getItem<Record<string, User>>(USERS_LIST_KEY, MOCK_USERS);
    return existing;
  },

  async getCurrentUser(): Promise<User | null> {
    const user = await storageService.getItem<User | null>(AUTH_USER_KEY, null);
    return user;
  },

  async setCurrentUser(user: User | null): Promise<void> {
    if (user) {
      await storageService.setItem(AUTH_USER_KEY, user);
    } else {
      await storageService.removeItem(AUTH_USER_KEY);
    }
  },

  async login(identifier: string, _password: string): Promise<{ user: User; token: string }> {
    // Simulated network delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    const users = await this.initUsers();
    // Check if matches phone or email of any known user
    const found = Object.values(users).find(
      (u) =>
        u.email.toLowerCase() === identifier.trim().toLowerCase() ||
        u.phone.replace(/\s+/g, '') === identifier.replace(/\s+/g, '')
    );

    if (found) {
      if (found.status === 'suspended') {
        throw new Error('This account has been suspended by the platform administrator.');
      }
      await this.setCurrentUser(found);
      return { user: found, token: `tv_token_${found.id}` };
    }

    // If identifier doesn't match predefined, create a realistic buyer session
    const newUser: User = {
      id: `user-${Date.now()}`,
      fullName: identifier.includes('@') ? identifier.split('@')[0] : 'Prosper Kamga',
      email: identifier.includes('@') ? identifier : 'user@terraverify.cm',
      phone: identifier.startsWith('+') ? identifier : '+237 677 00 00 00',
      role: 'buyer',
      isPhoneVerified: true,
      registeredAt: new Date().toISOString(),
      status: 'active',
    };

    users[newUser.id] = newUser;
    await storageService.setItem(USERS_LIST_KEY, users);
    await this.setCurrentUser(newUser);

    return { user: newUser, token: `tv_token_${newUser.id}` };
  },

  async register(params: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    role: UserRole;
  }): Promise<{ user: User; token: string }> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newUser: User = {
      id: `user-${Date.now()}`,
      fullName: params.fullName,
      email: params.email.toLowerCase().trim(),
      phone: params.phone.trim(),
      role: params.role,
      isPhoneVerified: true,
      registeredAt: new Date().toISOString(),
      status: 'active',
      avatarUrl:
        params.role === 'surveyor'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
          : params.role === 'advisor'
          ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80'
          : params.role === 'seller'
          ? 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    };

    const users = await this.initUsers();
    users[newUser.id] = newUser;
    await storageService.setItem(USERS_LIST_KEY, users);
    await this.setCurrentUser(newUser);

    return { user: newUser, token: `tv_token_${newUser.id}` };
  },

  async verifyOtp(tempUserId: string, otp: string): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (otp !== '123456' && otp.length !== 6) {
      throw new Error('Invalid verification code. Please enter the 6-digit code sent to your phone (Demo code: 123456).');
    }

    let user = await storageService.getItem<User | null>(`pending_user_${tempUserId}`, null);
    if (!user) {
      user = MOCK_USERS.buyer;
    }
    user.isPhoneVerified = true;
    await this.setCurrentUser(user);
    return user;
  },

  async logout(): Promise<void> {
    await storageService.removeItem(AUTH_USER_KEY);
  },

  // Switch roles instantly during defense presentation
  async switchDemoRole(role: UserRole): Promise<User | null> {
    if (role === 'visitor') {
      await this.setCurrentUser(null);
      return null;
    }
    const mockUser = MOCK_USERS[role] || MOCK_USERS.buyer;
    await this.setCurrentUser(mockUser);
    return mockUser;
  },

  async getAllUsers(): Promise<User[]> {
    const users = await this.initUsers();
    return Object.values(users);
  },

  async toggleUserStatus(userId: string): Promise<User> {
    const users = await this.initUsers();
    const user = users[userId] || Object.values(users).find(u => u.id === userId);
    if (!user) throw new Error('User not found');
    user.status = user.status === 'active' ? 'suspended' : 'active';
    await storageService.setItem(USERS_LIST_KEY, users);
    return user;
  },
};
