import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      return tokenPayload.exp && tokenPayload.exp > now;
    }
    catch (e) {
      console.error(e)
      return false
    }
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  constructor() {}
}
