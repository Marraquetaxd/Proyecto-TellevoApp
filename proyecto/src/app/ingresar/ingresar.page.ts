import { Component, OnInit } from '@angular/core';
import { TripsService } from '../services/trip.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastController } from '@ionic/angular'; // Importar ToastController

@Component({
  selector: 'app-ingresar',
  templateUrl: './ingresar.page.html',
  styleUrls: ['./ingresar.page.scss'],
})
export class IngresarPage implements OnInit {
  allTrips: any[] = []; // Todos los viajes

  constructor(
    private tripsService: TripsService,
    private router: Router,
    private authService: AuthService,
    private toastController: ToastController // Inyectar ToastController
  ) {}

  ngOnInit() {
    this.loadAllTrips(); // Cargar todos los viajes al iniciar la página
  }

  // Método para cargar todos los viajes
  async loadAllTrips() {
    this.allTrips = await this.tripsService.getTrips(); // Obtener todos los viajes
  }

  // Método para unirse a un viaje
  async joinTrip(trip: any) {
    const currentUser = await this.authService.getCurrentUser();
    if (currentUser) {
      console.log(`Usuario ${currentUser.username} se unió al viaje ${trip.origin} - ${trip.destination}`);

      // Mostrar mensaje de éxito
      const toast = await this.toastController.create({
        message: 'Viaje solicitado con éxito',
        duration: 2000, // Duración de 2 segundos
        position: 'bottom', // Mostrar en la parte inferior
        color: 'success', // Color verde para éxito
      });

      await toast.present();

      // Redirigir a una página de detalles del viaje
      this.router.navigate(['/viaje-detalle', trip.id]);
    }
  }

  // Método para ver el mapa del viaje
  viewMap(trip: any) {
    // Redirigir a la página de mapa, pasando la información del viaje
    this.router.navigate(['/viaje-mapa', trip.id]);
  }
}
