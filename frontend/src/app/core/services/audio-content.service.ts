import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { AudioContent, CreateAudioContentRequest } from '@app/core/models/audio-content.model';

@Injectable({ providedIn: 'root' })
export class AudioContentService {
  private readonly baseUrl = `${environment.apiUrl}/audiocontents`;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<AudioContent[]> {
    return this.http.get<AudioContent[]>(this.baseUrl);
  }

  getByCategory(category: string): Observable<AudioContent[]> {
    return this.http.get<AudioContent[]>(`${this.baseUrl}/category/${category}`);
  }

  getById(id: string): Observable<AudioContent> {
    return this.http.get<AudioContent>(`${this.baseUrl}/${id}`);
  }

  create(request: CreateAudioContentRequest): Observable<AudioContent> {
    return this.http.post<AudioContent>(this.baseUrl, request);
  }

  update(id: string, request: CreateAudioContentRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
