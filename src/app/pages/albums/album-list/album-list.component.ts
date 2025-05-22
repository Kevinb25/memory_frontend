import { Component } from '@angular/core';
import { AlbumCardComponent } from '../../../components/album-card/album-card.component';
import { AuthService } from '../../../services/auth.service';
import { AlbumService } from '../../../services/album.service';
import { Router } from '@angular/router';
import { IAlbumUser } from '../../../interfaces/album.interface';
import { IUser } from '../../../interfaces/user.interface';

@Component({
  selector: 'app-album-list',
  imports: [AlbumCardComponent],
  templateUrl: './album-list.component.html',
  styleUrl: './album-list.component.css'
})
export class AlbumListComponent {
  ownedAlbums: IAlbumUser[] = [];
  sharedAlbums: IAlbumUser[] = [];
  currentUser: IUser | null = null;

  constructor(
    private albumService: AlbumService,
    private authService: AuthService,
    private router: Router
  ) { }

  async ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) return;

    const allAlbums = await this.albumService.getAlbumsByUserId(this.currentUser.id);
    this.ownedAlbums = allAlbums.filter(a => a.role === 'owner');
    this.sharedAlbums = allAlbums.filter(a => a.role !== 'owner');
  }

  goToAlbum(id: number) {
    this.router.navigate(['/albums', id]);
  }
}