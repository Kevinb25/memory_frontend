import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { IUser } from '../../interfaces/user.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  authService = inject(AuthService);
  user: IUser | null = this.authService.getCurrentUser();
  newUsername = '';
  selectedFile: File | null = null;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  async changeAvatar() {
    if (!this.selectedFile || !this.user) return;

    const formData = new FormData();
    formData.append('avatar', this.selectedFile);

    try {
      const response = await fetch(`http://localhost:3000/api/users/${this.user.id}/avatar`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'No se pudo actualizar el avatar');
      }

      this.authService.saveSession(data.updatedAvatar, localStorage.getItem('token')!);
      this.user = data.updatedAvatar;
      this.selectedFile = null;

      Swal.fire('✅ Avatar actualizado', '', 'success');
    } catch (err: any) {
      Swal.fire('❌ Error', err.message || 'Error inesperado', 'error');
    }
  }

  async changeUsername() {
    if (!this.user || !this.newUsername.trim()) return;

    try {
      const response = await fetch(`http://localhost:3000/api/users/${this.user.id}/username`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ username: this.newUsername })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'No se pudo cambiar el nombre de usuario');
      }

      this.authService.saveSession(data.updated, localStorage.getItem('token')!);
      this.user = data.updated;
      this.newUsername = '';

      Swal.fire('✅ Usuario actualizado', '', 'success');
    } catch (err: any) {
      Swal.fire('❌ Error', err.message || 'Error inesperado', 'error');
    }
  }
}