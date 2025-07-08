import { AlbumService } from './../../services/album.service';

import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { IUser } from '../../interfaces/user.interface';
import { UserCardComponent } from "../../components/user-card/user-card.component";
import { AlbumListComponent } from '../albums/album-list/album-list.component';
import { IAlbumUser } from '../../interfaces/album.interface';
import { AlbumCreateComponent } from "../albums/album-create/album-create.component";
import Swal from 'sweetalert2';



@Component({
  selector: 'app-home',
  imports: [UserCardComponent, AlbumListComponent, AlbumCreateComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  authService = inject(AuthService)
  user: IUser | null = this.authService.getCurrentUser();
  pendingInvites: IAlbumUser[] = [];
  albumService = inject(AlbumService);

  async ngOnInit() {
    this.user = this.authService.getCurrentUser();

    if (!this.user) return;

    this.pendingInvites = await this.albumService.getPendingInvitations(this.user.id);
  }
  async aceptarInvitacion(albumId: number) {
    if (!this.user) return;

    try {
      await this.albumService.acceptInvitation(albumId, this.user.id);
      console.log('✅ Invitación aceptada');

      // Opcional: actualizar la lista
      this.pendingInvites = this.pendingInvites.filter(i => i.albumId !== albumId);
    } catch (error) {
      console.error('Error al aceptar la invitación:', error);
    }
  }
  async cargarInvitaciones() {
    const user = this.authService.getCurrentUser();
    if (!user) {
      console.warn('No hay usuario autenticado.');
      return;
    }

    try {
      const response = await fetch(`http://apiUrl/api/albums_users/pending/${user.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Error al obtener invitaciones:', data.error);
        return;
      }

      this.pendingInvites = data;
    } catch (error) {
      console.error('Error inesperado al cargar invitaciones:', error);
    }
  }
  async rechazarInvitacion(albumId: number) {
    const userId = this.authService.getCurrentUser()?.id;

    if (!userId) {
      console.error('No hay usuario autenticado');
      return;
    }

    const confirm = await Swal.fire({
      title: '¿Rechazar invitación?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, rechazar',
      cancelButtonText: 'Cancelar'
    });

    if (!confirm.isConfirmed) return;

    try {
      const response = await fetch(`http://apiUrl/api/albums_users/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ albumId, userId })
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Error al rechazar invitación:', data.error);
        Swal.fire('❌ Error', data.error || 'No se pudo rechazar la invitación', 'error');
        return;
      }

      Swal.fire('✅ Invitación rechazada', 'La invitación ha sido eliminada', 'success');

      // ✅ Eliminar manualmente del array
      this.pendingInvites = this.pendingInvites.filter(i => i.albumId !== albumId);

    } catch (err) {
      console.error('Error al rechazar invitación:', err);
      Swal.fire('❌ Error inesperado', 'Intenta nuevamente más tarde', 'error');
    }
  }
}