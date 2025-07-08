import { IAlbum, IAlbumUser } from './../interfaces/album.interface';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { lastValueFrom } from 'rxjs';
import { IAlbumParticipant } from '../interfaces/user.interface';

type albumUserResponse = IAlbumUser
type albumResponse = IAlbum;
type iAlbumsUsers = IAlbumParticipant

type albumBody = {
  userId: number;
  name: string;
  theme: string;
  category?: string;
};

type updateAlbumBody = {
  name?: string;
  category?: string;
  theme?: string;
}
type UpdateAlbumResponse = {
  message: string;
  album: IAlbum[];
};
@Injectable({
  providedIn: 'root'
})

export class AlbumService {

  private baseUrl = `${environment.apiUrl}/album`;
  private HttpClient = inject(HttpClient);

  createNewAlbum(body: albumBody): Promise<{ albumId: number; publicToken: string }> {
    return lastValueFrom(
      this.HttpClient.post<{ albumId: number; publicToken: string }>(`${this.baseUrl}`, body)
    );
  }

  getAlbumByToken(token: string) {
    return lastValueFrom(
      this.HttpClient.get<albumResponse>(`${this.baseUrl}/viewer/${token}`)
    );
  }
  getAlbumById(albumId: number): Promise<{ album: IAlbum; users: IAlbumParticipant[] }> {
    return lastValueFrom(
      this.HttpClient.get<{ album: IAlbum; users: IAlbumParticipant[] }>(
        `${this.baseUrl}/${albumId}`
      )
    );
  }
  updateAlbum(id: number, body: updateAlbumBody) {
    return lastValueFrom(this.HttpClient.put<UpdateAlbumResponse>(`${this.baseUrl}/${id}`, body))
  }
  searchAlbumByName(name: string) {
    const cleanName = this.normalizeName(name);
    return lastValueFrom(
      this.HttpClient.get<IAlbum[]>(`${this.baseUrl}/search/name`, {
        params: { name: cleanName }
      })
    );
  }

  private normalizeName(name: string): string {
    return name
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }


  deleteAlbum(id: number): Promise<{ message: string }> {
    return lastValueFrom(
      this.HttpClient.delete<{ message: string }>(`${this.baseUrl}/${id}`)
    );
  }



  getAlbumsByUserId(userId: number): Promise<IAlbumUser[]> {
    return lastValueFrom(
      this.HttpClient.get<IAlbumUser[]>(`${this.baseUrl}/user/${userId}`)
    );
  }


  generateUploadToken(albumId: number): Promise<{ uploadToken: string }> {
    return lastValueFrom(
      this.HttpClient.post<{ uploadToken: string }>(
        `${environment.apiUrl}/album/upload-token/${albumId}`, {}
      )
    );
  }

  getAlbumByUploadToken(token: string): Promise<IAlbum> {
    return lastValueFrom(
      this.HttpClient.get<IAlbum>(`${this.baseUrl}/albums/upload-access/${token}`)
    );
  }
  getParticipantsByAlbumId(albumId: number): Promise<iAlbumsUsers[]> {
    return lastValueFrom(
      this.HttpClient.get<iAlbumsUsers[]>(`${environment.apiUrl}/albums_users/album/${albumId}`)
    );
  }
  getAlbumQr(token: string): Promise<string> {
    return lastValueFrom(
      this.HttpClient.get<{ qrImage: string }>(
        `${environment.apiUrl}/auth/album/qr/${token}`
      )
    ).then(res => res.qrImage);
  }
  getPendingInvitations(userId: number): Promise<IAlbumUser[]> {
    return lastValueFrom(
      this.HttpClient.get<IAlbumUser[]>(
        `${environment.apiUrl}/albums_users/user/${userId}/pending`
      )
    );

  }
  async acceptInvitation(albumId: number, userId: number) {
    console.log('📤 Enviando aceptación de invitación:', { albumId, userId });
    const response = await fetch(`${environment.apiUrl}/albums_users/accept`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ albumId, userId }) // <== Importante que estén bien escritos
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error al aceptar la invitación');
    }

    return data;
  }
  rejectInvitation(albumId: number, userId: number): Promise<Response> {
    return fetch(`${environment.apiUrl}/albums_users/reject`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ albumId, userId })
    });
  }
}
