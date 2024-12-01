import { Component, OnInit } from '@angular/core';
import { TripsService } from '../services/trip.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transporte',
  templateUrl: './transporte.page.html',
  styleUrls: ['./transporte.page.scss'],
})
export class TransportePage implements OnInit {
  tripHistory: any[] = [];  // Array para almacenar el historial de viajes

  constructor(private tripsService: TripsService, private router: Router) {}

  async ngOnInit() {
    await this.loadTripHistory();  // Cargar el historial de viajes al iniciar la página
  }

  // Método para cargar el historial de viajes
  async loadTripHistory() {
    const driverId = await this.tripsService.getCurrentDriverId(); // Obtener el ID del conductor
    console.log('ID del conductor:', driverId); // Verifica el ID del conductor

    if (driverId) {
      this.tripHistory = await this.tripsService.getTrips(driverId); // Obtener los viajes del conductor
      console.log('Historial de viajes:', this.tripHistory); // Verifica el historial de viajes
    } else {
      console.log('No se encontró el ID del conductor');
    }
  }

  // Método para redirigir al usuario a la página de crear un nuevo viaje
  startNewTrip() {
    this.router.navigate(['/viaje']);  // Redirigir a la página de creación de un nuevo viaje
  }
}
