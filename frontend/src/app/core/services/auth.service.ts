import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '@env/environment';
import { AuthResponse, LoginRequest, RegisterRequest } from '@app/core/models/auth.model';

const STORAGE_KEY = 'talamis.auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = `${environment.apiUrl}/auth`;

  // Signal-based auth state, seeded from localStorage so a page refresh
  // doesn't log the user out.
  private readonly _session = signal<AuthResponse | null>(this.readStoredSession());

  readonly session = this._session.asReadonly();
  readonly isAuthenticated = computed(() => this._session() !== null);
  readonly currentUser = computed(() => {
    const s = this._session();
    return s ? { userId: s.userId, fullName: s.fullName, email: s.email } : null;
  });

  constructor(private readonly http: HttpClient) {}

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/register`, request)
      .pipe(tap((res) => this.persistSession(res)));
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/login`, request)
      .pipe(tap((res) => this.persistSession(res)));
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    this._session.set(null);
  }

  getToken(): string | null {
    return this._session()?.token ?? null;
  }

  private persistSession(session: AuthResponse): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    this._session.set(session);
  }

  private readStoredSession(): AuthResponse | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as AuthResponse;
      // Drop expired sessions on load.
      if (new Date(parsed.expiresAtUtc).getTime() <= Date.now()) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  }
}
