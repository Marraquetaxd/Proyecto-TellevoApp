import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.page.html',
  styleUrls: ['./editar.page.scss'],
})
export class EditarPage implements OnInit {
  updatedUser: any = {};

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.loadUserData();
  }

  // Método para cargar los datos del usuario actual
  async loadUserData() {
    const currentUser = await this.authService.getCurrentUser(); // Ahora es asíncrono

    if (currentUser) {
      this.updatedUser = { ...currentUser };
    } else {
      console.error('No se encontró el usuario actual.');
    }
  }

  // Método que se ejecuta al enviar el formulario
  async onSubmit() {
    if (this.updatedUser.username && this.updatedUser.fullName && this.updatedUser.birthdate) {
      // Formatear la fecha antes de actualizar
      this.updatedUser.birthdate = new Date(this.updatedUser.birthdate).toISOString().split('T')[0];
      
      await this.authService.updateUser(this.updatedUser); // Ahora es asíncrono

      // Navega a la página de perfil y recarga la página
      this.router.navigate(['/perfil']).then(() => {
        window.location.reload();
      });
    } else {
      console.error('Por favor complete todos los campos.');
    }
  }
}
