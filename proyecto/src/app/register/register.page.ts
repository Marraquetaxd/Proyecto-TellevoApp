import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { ViewChild } from '@angular/core';
import { IonDatetime } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  fullName: string = '';
  username: string = '';
  birthdate: string = ''; 
  contra: string = '';
  confirmPassword: string = '';
  tipo_usuario: string = "";
  usernameError: string = '';
  passwordError: string = '';

  // New vehicle-related properties
  vehicleBrand: string = '';
  vehicleModel: string = '';
  vehicleYear: number | null = null;
  vehiclePlate: string = '';

  constructor(
    private router: Router,
    private alertController: AlertController,
    private authService: AuthService
  ) {}

  validatePassword() {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z]).{8,}$/;
    
    if (!this.contra) {
      this.passwordError = 'La contraseña es requerida';
    } else if (this.contra.length < 8) {
      this.passwordError = 'La contraseña debe tener al menos 8 caracteres';
    } else if (!passwordRegex.test(this.contra)) {
      this.passwordError = 'La contraseña debe contener al menos una mayúscula';
    } else {
      this.passwordError = '';
    }
  }

  async onSubmit() {
    if (this.contra !== this.confirmPassword) {
      await this.presentAlert('Las contraseñas no coinciden.');
      return;
    }

    const [firstName, lastName] = this.fullName.split(' ');

    // Different registration logic based on user type
    if (this.tipo_usuario === 'chofer') {
      // Validate vehicle information
      if (!this.vehicleBrand || !this.vehicleModel || !this.vehicleYear || !this.vehiclePlate) {
        await this.presentAlert('Por favor complete toda la información del vehículo.');
        return;
      }

      const isRegistered = await this.authService.register(
        firstName || '',
        lastName || '',
        this.username,
        this.contra,
        this.birthdate,
        this.tipo_usuario,
        // Pass additional vehicle details
        {
          vehicleBrand: this.vehicleBrand,
          vehicleModel: this.vehicleModel,
          vehicleYear: this.vehicleYear,
          vehiclePlate: this.vehiclePlate
        }
      );

      if (isRegistered) {
        this.router.navigate(['/home']);
      } else {
        await this.presentAlert('El nombre de usuario ya está en uso');
      }
    } else {
      // Regular passenger registration
      const isRegistered = await this.authService.register(
        firstName || '',
        lastName || '',
        this.username,
        this.contra,
        this.birthdate,
        this.tipo_usuario
      );

      if (isRegistered) {
        this.router.navigate(['/home']);
      } else {
        await this.presentAlert('El nombre de usuario ya está en uso');
      }
    }
  }

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Registro',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  clearForm() {
    this.fullName = '';
    this.username = '';
    this.birthdate = '';
    this.contra = '';
    this.confirmPassword = '';
    this.tipo_usuario = '';

    // Clear vehicle-related fields
    this.vehicleBrand = '';
    this.vehicleModel = '';
    this.vehicleYear = null;
    this.vehiclePlate = '';
  }

  isDateTimeOpen = false;
}