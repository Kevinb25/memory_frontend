import { Injectable } from '@angular/core';
import { IUser } from '../interfaces/user.interface';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly tokenKey = 'token';
    private readonly userKey = 'user';

    // Guardar token y usuario en localStorage
    saveSession(user: IUser, token: string) {
        localStorage.setItem(this.userKey, JSON.stringify(user));
        localStorage.setItem(this.tokenKey, token);
    }

    // Obtener usuario actual
    getCurrentUser(): IUser | null {
        const data = localStorage.getItem(this.userKey);
        return data ? JSON.parse(data) : null;
    }

    // Obtener token
    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    // Saber si está logueado
    isLoggedIn(): boolean {
        return !!this.getToken();
    }

    // Cerrar sesión
    logout(): void {
        localStorage.removeItem(this.userKey);
        localStorage.removeItem(this.tokenKey);
    }
    mapUserFromBackend(raw: any): IUser {
        return {
            id: raw.id,
            username: raw.username,
            email: raw.email,
            avatarUrl: raw.avatar_url,
            qrToken: raw.qr_token
        };
    }
}