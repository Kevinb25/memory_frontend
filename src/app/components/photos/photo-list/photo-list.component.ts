import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-photo-list',
  templateUrl: './photo-list.component.html',
  styleUrls: ['./photo-list.component.css'],

})
export class PhotoListComponent {
  @Input() photos: { id: number; url: string; type: 'image' | 'video'; name?: string }[] = [];
  @Output() photoSelected = new EventEmitter<number>();

  selectPhoto(photoId: number) {
    this.photoSelected.emit(photoId);
  }
}