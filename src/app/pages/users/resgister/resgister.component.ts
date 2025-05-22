import { UserService } from './../../../services/user.service';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-resgister',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './resgister.component.html',
  styleUrl: './resgister.component.css'
})
export class ResgisterComponent {

  registerForm: FormGroup;
  usersService = inject(UserService);
  router = inject(Router)

  constructor() {
    this.registerForm = new FormGroup({
      username: new FormControl(),
      email: new FormControl(),
      password: new FormControl()

    })
  }

  async onSubmit() {
    try {
      const response = await this.usersService.register(this.registerForm.value);
      Swal.fire('Registro', 'Te has registrado correctamente', 'success')
      this.router.navigateByUrl('/login')
    } catch (error) {

      Swal.fire('Registro', 'Ha ocurrido un error en el registro, vuelve a intentarlo', 'error')
    }
  }
}