import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service'; // ⬅️ nuevo
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { mapUser } from '../../../utils/mapper.util';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm: FormGroup;
  usersService = inject(UserService);
  authService = inject(AuthService); // ⬅️ nuevo
  router = inject(Router);

  constructor() {
    this.loginForm = new FormGroup({
      email: new FormControl(),
      password: new FormControl()
    });
  }

  async onSubmit() {
    try {
      const response = await this.usersService.login(this.loginForm.value);
      const user = mapUser(response.user);
      this.authService.saveSession(user, response.token);

      Swal.fire('Login', 'Login correcto', 'success');
      this.router.navigateByUrl('/home');
    } catch (error) {
      Swal.fire('Login', 'Error en email y/o contraseña', 'error');
    }
  }
}