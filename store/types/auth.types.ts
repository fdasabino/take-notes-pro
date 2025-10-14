export interface AuthUser {
  imageURL?: string | null;
  name?: string | null;
  uid: string;
  email: string | null;
}

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}
