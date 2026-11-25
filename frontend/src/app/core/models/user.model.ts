export interface Role {
  id: number;
  name: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  cin?: string;
  telephone?: string;
  adresse?: string;
  region?: string;
  province?: string;
  commune?: string;
  photo_profil?: string;
  actif: boolean;
  roles: Role[];
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  cin: string;
  telephone: string;
  region: string;
  province: string;
  commune: string;
}