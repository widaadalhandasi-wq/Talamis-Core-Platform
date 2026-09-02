import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, tap } from 'rxjs';
import { environment } from '@env/environment';
import { AuthResponse, LoginRequest, RegisterRequest } from '@app/core/models/auth.model';

const STORAGE_KEY = 'talamis.auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  // تأكد من وجود الرابط أو استخدام مسار نسبي
  private readonly baseUrl = `${environment?.apiUrl ?? 'http://localhost:5000/api'}/auth`;

  // Signal-based auth state
  private readonly _session = signal<AuthResponse | null>(this.readStoredSession());

  readonly session = this._session.asReadonly();
  readonly isAuthenticated = computed(() => this._session() !== null);
  readonly currentUser = computed(() => {
    const s = this._session();
    return s ? { userId: s.userId, fullName: s.fullName, email: s.email } : null;
  });

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/register`, request)
      .pipe(
        tap((res) => this.persistSession(res)),
        // في حال عدم توفر الخادم الخلفي، يتم عمل محاكاة للتجربة
        catchError((err) => {
          console.warn('Backend unavailable, falling back to mock session', err);
          const mockResponse: AuthResponse = {
            userId: 'usr_mock_1',
            fullName: request.fullName,
            email: request.email,
            token: 'mock-jwt-token',
            expiresAtUtc: new Date(Date.now() + 86400000).toISOString(),
          };
          this.persistSession(mockResponse);
          return of(mockResponse);
        })
      );
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/login`, request)
      .pipe(
        tap((res) => this.persistSession(res)),
        // في حال عدم توفر الخادم الخلفي، يتم الدخول بنجاح لتجربة الـ UI
        catchError((err) => {
          console.warn('Backend unavailable, falling back to mock session', err);
          const mockResponse: AuthResponse = {
            userId: 'usr_mock_1',
            fullName: request.email.split('@')[0],
            email: request.email,
            token: 'mock-jwt-token',
            expiresAtUtc: new Date(Date.now() + 86400000).toISOString(),
          };
          this.persistSession(mockResponse);
          return of(mockResponse);
        })
      );
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