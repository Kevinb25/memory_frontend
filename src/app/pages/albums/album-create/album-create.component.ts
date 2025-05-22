import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlbumService } from '../../../services/album.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-album-create',
  imports: [ReactiveFormsModule],
  templateUrl: './album-create.component.html',
  styleUrl: './album-create.component.css'
})
export class AlbumCreateComponent {
  albumForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private albumService: AlbumService,
    private authService: AuthService,
    private router: Router
  ) {
    this.albumForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      category: [''],
      theme: ['']
    });
  }

  async onSubmit() {
    if (this.albumForm.invalid) return;

    const user = this.authService.getCurrentUser();
    if (!user) {
      this.errorMessage = 'Usuario no autenticado';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    try {
      const { name, category, theme } = this.albumForm.value;
      const result = await this.albumService.createNewAlbum({
        userId: user.id,
        name: name!,
        category: category || '',
        theme: theme!
      });

      this.router.navigate(['/albums', result.albumId]);

    } catch (err) {
      console.error(err);
      this.errorMessage = 'Hubo un error al crear el álbum.';
    } finally {
      this.isSubmitting = false;
    }
  }
}