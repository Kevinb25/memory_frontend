import { Routes } from '@angular/router';
import { PhotoViewComponent } from './pages/photos/photo-view/photo-view.component';
import { ResgisterComponent } from './pages/users/resgister/resgister.component';
import { LoginComponent } from './pages/users/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AlbumListComponent } from './pages/albums/album-list/album-list.component';
import { AlbumCreateComponent } from './pages/albums/album-create/album-create.component';
import { AlbumViewComponent } from './pages/albums/album-view/album-view.component';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard'; // ✅

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: '/register' },
    { path: 'register', component: ResgisterComponent, canActivate: [guestGuard] },
    { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
    { path: 'home', component: HomeComponent, canActivate: [authGuard] },
    { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
    { path: 'albums', component: AlbumListComponent, canActivate: [authGuard] },
    { path: 'albums/create', component: AlbumCreateComponent, canActivate: [authGuard] },
    { path: 'albums/:id', component: AlbumViewComponent, canActivate: [authGuard] },
    { path: 'photos/:id', component: PhotoViewComponent, canActivate: [authGuard] },

    { path: '**', redirectTo: '/register' }
];