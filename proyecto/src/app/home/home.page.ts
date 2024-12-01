import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  firstName: string = '';
  usuario: String='';  
  userType: string = ''; // Determina si es 'driver' o 'client'
  profileImage: string = 'https://ionicframework.com/docs/img/demos/avatar.svg'; // Imagen por defecto

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loadUserData(); // Carga los datos del usuario al iniciar
  
    // Manejo de la promesa para obtener el tipo de usuario
    this.authService.getCurrentUserType().then((userType) => {
      this.userType = userType;
    }).catch((error) => {
      console.error('Error al obtener el tipo de usuario:', error);
    });
  }
  

  // Método para cargar los datos del usuario
  async loadUserData() {
    const currentUser = await this.authService.getCurrentUser(); // Ahora es asíncrono
    const isAuthenticated = await this.authService.isAuthenticated(); // Verifica si el usuario está autenticado

    if (currentUser && isAuthenticated) {
      // Si el usuario está autenticado, toma su nombre
      const fullNameParts = (currentUser.fullName || '').split(' ');
      this.firstName = fullNameParts[0] || 'Invitado'; // Toma el primer nombre o muestra 'Invitado'
      this.usuario= currentUser.tipo_usuario ||'',
      // Establece la imagen de perfil, si existe
      this.profileImage = currentUser.profileImage || this.profileImage;
    }
  }
}
