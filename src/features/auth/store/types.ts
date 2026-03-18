export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => void;
  logout: () => void;
}
