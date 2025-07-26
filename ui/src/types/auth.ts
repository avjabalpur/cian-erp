export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  department?: string;
  designation?: string;
}

export interface LoginRequest {
  username?: string;
  email?: string;
  password?: string;
}

export interface RegisterRequest extends Omit<User, 'id' | 'roles'> {
  password?: string;
}

export interface TokenValidationRequest {
  token?: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  userId: number;
  refreshToken: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  department?: string;
  designation?: string;
}
