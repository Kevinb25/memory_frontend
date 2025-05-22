import { Component, Input } from '@angular/core';
import { IUser } from '../../interfaces/user.interface';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-card',
  imports: [RouterModule],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.css'
})
export class UserCardComponent {
  @Input() user!: IUser;
  @Input() currentUser!: IUser;

  logout() {
    localStorage.clear();
    location.href = '/login';
  }
  get userAvatar(): string {
    return this.currentUser?.avatarUrl || '/images/default-avatar.png';
  }
}
