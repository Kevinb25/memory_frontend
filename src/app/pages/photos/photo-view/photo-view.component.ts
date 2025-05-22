import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PhotoService } from '../../../services/photo.service';

@Component({
  selector: 'app-photo-view',
  imports: [CommonModule, RouterModule],
  templateUrl: './photo-view.component.html',
  styleUrls: ['./photo-view.component.css']
})
export class PhotoViewComponent {
  photo: any = null;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private photoService: PhotoService,

  ) { }

  async ngOnInit() {
    const photoId = Number(this.route.snapshot.paramMap.get('id'));

    if (isNaN(photoId)) {
      this.error = 'ID de foto inválido.';
      return;
    }

    try {
      this.photo = await this.photoService.getPhotoById(photoId);
      this.loading = false;
    } catch (err) {
      console.error('Error al cargar la foto:', err);
      this.error = 'No se pudo cargar la foto.';
      this.loading = false;
    }
  }

  volver() {
    this.router.navigate(['/albums', this.photo.album_id]);
  }
  async eliminarFoto() {
    const confirmar = confirm('¿Estás seguro de que deseas eliminar esta foto? Esta acción no se puede deshacer.');
    if (!confirmar) return;

    try {
      const photoId = this.photo.id;
      const albumId = this.photo.album_id;

      // Limpia la foto para que no vuelva a intentar cargarla
      this.photo = null;

      await this.photoService.deletePhoto(photoId);
      alert('Foto eliminada exitosamente.');

      // Redirige al álbum después de borrar
      this.router.navigate(['/albums', albumId]);
    } catch (err) {
      console.error('Error al eliminar la foto:', err);
      alert('Ocurrió un error al eliminar la foto.');
    }
  }
}
