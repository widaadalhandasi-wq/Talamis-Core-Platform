import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { CreateDailyPromptRequest, DailyPrompt } from '@app/core/models/daily-prompt.model';

@Injectable({ providedIn: 'root' })
export class DailyPromptService {
  private readonly baseUrl = `${environment.apiUrl}/dailyprompts`;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<DailyPrompt[]> {
    return this.http.get<DailyPrompt[]>(this.baseUrl);
  }

  getUpcoming(count = 7): Observable<DailyPrompt[]> {
    return this.http.get<DailyPrompt[]>(`${this.baseUrl}/upcoming`, {
      params: { count },
    });
  }

  getById(id: string): Observable<DailyPrompt> {
    return this.http.get<DailyPrompt>(`${this.baseUrl}/${id}`);
  }

  create(request: CreateDailyPromptRequest): Observable<DailyPrompt> {
    return this.http.post<DailyPrompt>(this.baseUrl, request);
  }

  update(id: string, request: CreateDailyPromptRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
