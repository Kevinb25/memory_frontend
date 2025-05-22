import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IAlbum } from '../../interfaces/album.interface';

@Component({
  selector: 'app-album-card',
  imports: [],
  templateUrl: './album-card.component.html',
  styleUrl: './album-card.component.css'
})
export class AlbumCardComponent {
  @Input() album!: IAlbum;
  @Output() view = new EventEmitter<number>();
  selectedImageUrl: string | null = null;

  emitView() {
    this.view.emit(this.album.id);
  }
  get albumImage(): string {

    return (
      this.selectedImageUrl ||
      this.album.coverUrl ||
      '/images/empty-album.png'
    );
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      this.selectedImageUrl = reader.result as string;
    };

    reader.readAsDataURL(file);
  }
}