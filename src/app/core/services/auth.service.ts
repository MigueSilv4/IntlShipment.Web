import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs';

export interface AuthResponse {
  success: boolean;
  data: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private url = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }) {
    return this.http.post<AuthResponse>(`${this.url}/login`, credentials)
      .pipe(tap(res => {
        if (res.success) localStorage.setItem('token', res.data);
      }));
  }

  register(user: { email: string; password: string }) {
    return this.http.post<AuthResponse>(`${this.url}/register`, user);
  }

  logout() { localStorage.removeItem('token'); }

  getToken() { return localStorage.getItem('token'); }

  isLoggedIn() { return !!this.getToken(); }
}