import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IAlbum } from '../../../interfaces/album.interface';
import { IAlbumParticipant, IUser } from '../../../interfaces/user.interface';
import { AlbumService } from '../../../services/album.service';
import { AuthService } from '../../../services/auth.service';
import { PhotoService } from '../../../services/photo.service';
import { InviteUserModalComponent } from '../../../components/invite-user-modal/invite-user-modal.component';
import { PhotoListComponent } from '../../../components/photos/photo-list/photo-list.component';
import { PhotoUploadComponent } from '../../../components/photos/photo-upload/photo-upload.component';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-album-view',
    standalone: true,
    imports: [
        CommonModule,
        InviteUserModalComponent,
        PhotoListComponent,
        PhotoUploadComponent
    ],
    templateUrl: './album-view.component.html',
    styleUrl: './album-view.component.css'
})
export class AlbumViewComponent {
    album!: IAlbum;
    participants: IAlbumParticipant[] = [];
    isAllowedToUpload = false;
    currentUser: IUser | null = null;
    userRole: 'owner' | 'editor' | 'viewer' = 'viewer';
    isOwner = false;
    qrBase64: string | null = null;
    qrMode: 'viewer' | 'uploader' | null = null;
    mostrarModalInvitacion = false;
    albumPhotos: { id: number; url: string; type: 'image' | 'video'; name?: string }[] = [];
    mostrarModalUpload = false;
    canLeaveAlbum = false;

    constructor(
        private route: ActivatedRoute,
        private albumService: AlbumService,
        private authService: AuthService,
        private router: Router,
        private photoService: PhotoService
    ) { }

    async ngOnInit() {
        const albumId = Number(this.route.snapshot.paramMap.get('id'));
        this.currentUser = this.authService.getCurrentUser();
        if (!this.currentUser) return;

        try {
            const response = await this.albumService.getAlbumById(albumId);
            this.album = response.album;
            this.album.publicToken = (this.album as any).public_token;
            this.album.userId = (this.album as any).user_id;
            this.participants = response.users;
            this.isOwner = this.album.userId === this.currentUser.id;

            const match = this.participants.find(p => p.id === this.currentUser?.id);
            if (match) {
                this.userRole = match.role;
                this.isAllowedToUpload = this.isOwner || (match.status === 'accepted' && match.role !== 'viewer');
                this.canLeaveAlbum = !this.isOwner && match.status === 'accepted';
            }
        } catch (err) {
            console.error('Error al cargar álbum:', err);
        }

        await this.loadPhotos(albumId);
    }

    abrirInvitacion() {
        this.mostrarModalInvitacion = true;
    }

    async mostrarQrSeleccion() {
        const result = await Swal.fire({
            title: '¿Qué tipo de QR deseas mostrar?',
            showDenyButton: true,
            confirmButtonText: 'Solo vista',
            denyButtonText: 'Participante'
        });

        if (result.isConfirmed) {
            await this.mostrarQr('viewer');
        } else if (result.isDenied) {
            await this.mostrarQr('uploader');
        }
    }

    async mostrarQr(modo: 'viewer' | 'uploader') {
        try {
            this.qrMode = modo;
            const token = modo === 'viewer'
                ? this.album.publicToken
                : (this.album.uploadToken || (await this.albumService.generateUploadToken(this.album.id)).uploadToken);

            if (!this.album.uploadToken && modo === 'uploader') {
                this.album.uploadToken = token;
            }

            this.qrBase64 = await this.albumService.getAlbumQr(token);
        } catch (err) {
            console.error('Error generando QR:', err);
        }
    }

    async loadPhotos(albumId: number) {
        try {
            const photos = await this.photoService.getPhotosByAlbum(albumId);
            this.albumPhotos = photos.map((photo: any) => {
                const extension = photo.photo_url.split('.').pop()?.toLowerCase();
                const type = extension?.startsWith('mp4') ? 'video' : 'image';
                return { id: photo.id, url: photo.photo_url, type, name: photo.title || '' };
            });
        } catch (err) {
            console.error('Error al cargar fotos:', err);
        }
    }

    abrirFoto(photoId: number) {
        this.router.navigate(['/photos', photoId]);
    }

    async subirFotoDesdeFormulario(formData: FormData) {
        if (!this.album?.id) return;
        formData.set('albumId', this.album.id.toString());

        try {
            await this.photoService.uploadPhoto(formData);
            this.mostrarModalUpload = false;
            await this.loadPhotos(this.album.id);
        } catch (err) {
            console.error('Error al subir foto:', err);
        }
    }

    async eliminarAlbum() {
        if (!this.isOwner) {
            await Swal.fire('Permiso denegado', 'Solo el creador puede eliminar el álbum.', 'error');
            return;
        }

        const confirm = await Swal.fire({
            title: '¿Eliminar álbum?',
            text: 'Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (!confirm.isConfirmed) return;

        try {
            await this.albumService.deleteAlbum(this.album.id);
            await Swal.fire('Eliminado', 'El álbum fue eliminado correctamente', 'success');
            this.router.navigate(['/home']);
        } catch (err) {
            console.error('Error al eliminar álbum:', err);
        }
    }

    async salirDelAlbum() {
        if (!this.album?.id || !this.currentUser?.id) return;

        const confirm = await Swal.fire({
            title: '¿Salir del álbum?',
            text: 'Perderás acceso a este contenido.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Salir',
            cancelButtonText: 'Cancelar'
        });

        if (!confirm.isConfirmed) return;

        try {
            const response = await fetch(`http://apiUrl/api/albums_users/leave`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ albumId: this.album.id, userId: this.currentUser.id })
            });

            const data = await response.json();
            if (!response.ok) {
                console.error('Error al salir:', data.error);
                await Swal.fire('Error', data.error, 'error');
                return;
            }

            await Swal.fire('Saliste del álbum', '', 'success');
            this.router.navigate(['/home']);
        } catch (err) {
            console.error('Error inesperado:', err);
        }
    }

    async onUserInvited() {
        this.mostrarModalInvitacion = false;
        if (!this.album?.id) return;

        try {
            const response = await this.albumService.getAlbumById(this.album.id);
            this.participants = response.users;

            const match = this.participants.find(p => p.id === this.currentUser?.id);
            if (match) {
                this.userRole = match.role;
                this.isAllowedToUpload = this.isOwner || (match.status === 'accepted' && match.role !== 'viewer');
                this.canLeaveAlbum = !this.isOwner && match.status === 'accepted';
            }
        } catch (error) {
            console.error('Error actualizando participantes:', error);
        }
    }
}