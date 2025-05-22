import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  private apiUrl = `${environment.apiUrl}/photos`;

  constructor(private http: HttpClient) { }

  // 📸 Obtener todas las fotos de un álbum
  async getPhotosByAlbum(albumId: number): Promise<any[]> {
    return await lastValueFrom(this.http.get<any[]>(`${this.apiUrl}/album/${albumId}`));
  }

  // 🆕 Subir una nueva foto o video
  async uploadPhoto(formData: FormData): Promise<any> {
    return await lastValueFrom(this.http.post<any>(this.apiUrl, formData));
  }

  // 🔍 Obtener una foto por su ID
  async getPhotoById(photoId: number): Promise<any> {
    return await lastValueFrom(this.http.get<any>(`${this.apiUrl}/${photoId}`));
  }

  // ✏️ Actualizar información de una foto
  async updatePhoto(photoId: number, data: {
    title?: string;
    note?: string;
    category?: string;
    takenDate?: string;
    location?: string;
  }): Promise<any> {
    return await lastValueFrom(this.http.put<any>(`${this.apiUrl}/${photoId}`, data));
  }

  // ❌ Eliminar una foto
  async deletePhoto(photoId: number): Promise<any> {
    return await lastValueFrom(this.http.delete<any>(`${this.apiUrl}/${photoId}`));
  }

  // 🗂️ Obtener fotos por categoría en un álbum
  async getPhotosByCategory(albumId: number, category: string): Promise<any[]> {
    return await lastValueFrom(
      this.http.get<any[]>(`${this.apiUrl}/category/${albumId}/${category}`)
    );
  }

  // 🔎 Buscar fotos por título en un álbum
  async searchPhotosByTitle(albumId: number, title: string): Promise<any[]> {
    const params = new HttpParams().set('title', title);
    return await lastValueFrom(
      this.http.get<any[]>(`${this.apiUrl}/search/${albumId}`, { params })
    );
  }

  // 💬 Reaccionar a una foto (si implementado)
  async reactToPhoto(photoId: number, reactionType: string): Promise<any> {
    return await lastValueFrom(
      this.http.post<any>(`${this.apiUrl}/${photoId}/react`, {
        reaction: reactionType
      })
    );
  }
}