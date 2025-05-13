import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginCredentials, RegisterCredentials } from '../models/credentials';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(credentials: LoginCredentials): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/sign-in`, credentials);
  }

  register(credentials: RegisterCredentials): Observable<any> {
    return this.http.put(`${this.baseUrl}/auth/sign-up`, credentials);
  }

  refreshToken(refreshToken: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/refresh-token`, { refreshToken });
  }

  getHomeTags(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/rest/home/tasks/tags`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  }
}
