import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { CreateUserSubmissionRequest, UserSubmission } from '@app/core/models/user-submission.model';

@Injectable({ providedIn: 'root' })
export class UserSubmissionService {
  private readonly baseUrl = `${environment.apiUrl}/usersubmissions`;

  constructor(private readonly http: HttpClient) {}

  getMine(): Observable<UserSubmission[]> {
    return this.http.get<UserSubmission[]>(`${this.baseUrl}/mine`);
  }

  getByPrompt(promptId: string): Observable<UserSubmission[]> {
    return this.http.get<UserSubmission[]>(`${this.baseUrl}/prompt/${promptId}`);
  }

  getById(id: string): Observable<UserSubmission> {
    return this.http.get<UserSubmission>(`${this.baseUrl}/${id}`);
  }

  create(request: CreateUserSubmissionRequest): Observable<UserSubmission> {
    return this.http.post<UserSubmission>(this.baseUrl, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
