export interface RegisterResponse {
  id: string;
  createdAt: { high: number; low: number; unsigned: string };
  updatedAt: { high: number; low: number; unsigned: string };
  email: string;
}
