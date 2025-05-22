import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { IUser } from '../interfaces/user.interface';

type UserBody = { username?: string, email: string, password: string };
type RegisterResponse = { message: string, userId: number, qrToken: string };
type LoginResponse = { message: string, token: string, user: IUser }



@Injectable({
  providedIn: 'root'
})
export class UserService {


  private baseUrl = `${environment.apiUrl}/auth`
  private httpClient = inject(HttpClient);

  register(body: UserBody) {
    return lastValueFrom(
      this.httpClient.post<RegisterResponse>(`${this.baseUrl}/register`, body)
    );
  }

  login(body: UserBody) {
    return lastValueFrom(
      this.httpClient.post<LoginResponse>(`${this.baseUrl}/login`, body)
    )
  }

  getLoginQrImage(token: string) {
    return lastValueFrom(
      this.httpClient.get<{ qrImage: string }>(`${this.baseUrl}/qr-image/${token}`)
    );
  }
}
