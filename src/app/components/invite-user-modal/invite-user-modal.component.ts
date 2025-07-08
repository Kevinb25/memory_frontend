import { environment } from './../../../environments/environment';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-invite-user-modal',
  imports: [CommonModule],
  templateUrl: './invite-user-modal.component.html',
  styleUrl: './invite-user-modal.component.css'
})
export class InviteUserModalComponent {
  @Input() albumId!: number;
  @Output() invited = new EventEmitter<void>();

  isOpen = false;
  errorMessage = '';
  isSubmitting = false;

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  async onSubmit(event: Event) {

    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const emailOrUsername = (form.elements.namedItem('emailOrUsername') as HTMLInputElement)?.value.trim();
    const role = (form.elements.namedItem('role') as HTMLSelectElement)?.value;
    console.log('🟡 Intentando invitar usuario con los siguientes datos:');
    console.log('albumId:', this.albumId);
    console.log('emailOrUsername:', emailOrUsername);
    console.log('role:', role);
    console.log('token:', localStorage.getItem('token'));
    if (!emailOrUsername || !role) {
      this.errorMessage = 'Todos los campos son obligatorios.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    try {
      const response = await fetch(`${environment.apiUrl}/albums_users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          albumId: this.albumId,
          emailOrUsername,
          role
        })
      });

      const data = await response.json();

      if (response.status === 409) {
        this.errorMessage = data.error || 'Ya has invitado a este usuario.';
        Swal.fire('❌ Invitación rechazada', this.errorMessage, 'warning');
        return;
      }

      if (!response.ok) {
        this.errorMessage = data.error || 'Error al invitar usuario';
        Swal.fire('❌ Error', this.errorMessage, 'error');
        return;
      }

      Swal.fire('✅ Invitación enviada', 'Usuario invitado correctamente', 'success');
      this.invited.emit();
      this.toggleDropdown(); // cerrar panel
    } catch (error) {
      console.error('Error invitando:', error);
      this.errorMessage = 'Error inesperado';
      Swal.fire('❌ Error inesperado', 'Intenta nuevamente más tarde', 'error');
    } finally {
      this.isSubmitting = false;
    }
  }
}