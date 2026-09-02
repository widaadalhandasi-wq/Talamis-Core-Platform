export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// Mirrors Talamis.DTOs.AuthResponseDto
export interface AuthResponse {
  userId: string;
  fullName: string;
  email: string;
  token: string;
  expiresAtUtc: string;
}
