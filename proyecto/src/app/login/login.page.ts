import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnDestroy {
  username: string = '';
  password: string = '';
  loginError: string = '';

  constructor(
    private router: Router, 
    private alertController: AlertController, 
    private authService: AuthService
  ) {}

  // Método que se ejecuta al enviar el formulario de inicio de sesión
  async onSubmit() {
    // Validación del nombre de usuario
    if (!this.validateUsername(this.username)) {
      this.loginError = 'Usuario incorrecto.';
      await this.presentAlert(this.loginError);
      return;
    }

    // Validación de la contraseña
    if (!this.validatePassword(this.password)) {
      this.loginError = 'Contraseña incorrecta.';
      await this.presentAlert(this.loginError);
      return;
    }

    try {
      // Intento de inicio de sesión
      const isAuthenticated = await this.authService.login(this.username, this.password);

      if (isAuthenticated) {
        this.loginError = '';
        // Si la autenticación es exitosa, navega a la página principal
        this.router.navigate(['/home']);
      } else {
        this.loginError = 'Nombre de usuario o contraseña incorrectos.';
        await this.presentAlert(this.loginError);
      }
    } catch (error) {
      // Manejo de cualquier error durante el inicio de sesión
      this.loginError = 'Error al intentar iniciar sesión. Por favor, inténtalo de nuevo.';
      await this.presentAlert(this.loginError);
    }
  }

  // Método para validar el nombre de usuario
  validateUsername(username: string): boolean {
    return username.length >= 3 && username.length <= 15;
  }

  // Método para validar la contraseña
  validatePassword(password: string): boolean {
    return password.length >= 4; // Valida una contraseña de al menos 4 caracteres
  }

  // Método para mostrar una alerta en caso de error
  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  // Método para navegar a la página de registro
  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  // Recargar la página cuando el componente se destruye
  ngOnDestroy() {
    window.location.reload();
  }
}
