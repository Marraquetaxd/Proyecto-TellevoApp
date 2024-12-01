import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root',
})
export class TripsService {
  private trips: any[] = []; // Lista de viajes en memoria
  private readonly STORAGE_KEY = 'trips'; // Clave para almacenar los viajes

  constructor(
    private authService: AuthService,
    private storageService: StorageService
  ) {
    this.loadTrips(); // Cargar viajes al inicializar
  }

  /**
   * Carga los viajes almacenados en el storage al iniciar el servicio
   */
  private async loadTrips(): Promise<void> {
    const storedTrips = await this.storageService.get(this.STORAGE_KEY);
    this.trips = Array.isArray(storedTrips) ? storedTrips : []; // Asegura que trips siempre sea un arreglo
  }
  async getTripById(tripId: string): Promise<any> {
    const trips = await this.getTrips();  // Obtener todos los viajes
    return trips.find(trip => trip.id === tripId);  // Buscar el viaje con el ID especificado
  }
  
  /**
   * Crea un nuevo viaje y lo guarda en el almacenamiento
   * @param trip Objeto con los datos del viaje
   */
  async createTrip(trip: any): Promise<void> {
    const driverId = await this.getCurrentDriverId(); // Obtén el ID del conductor actual

    if (!driverId) {
      console.error('No se pudo obtener el ID del conductor');
      return;  // Salir si no se obtiene el ID del conductor
    }

    const newTrip = { ...trip, driverId, costo: trip.costo || 0 };
    this.trips.push(newTrip);

    // Guardar los viajes actualizados en el almacenamiento
    await this.storageService.set(this.STORAGE_KEY, this.trips);
    console.log('Nuevo viaje creado y guardado:', newTrip);
  }
  
  /**
   * Obtiene el ID del conductor actual
   * @returns El ID del conductor actual
   */
  async getCurrentDriverId(): Promise<string> {
    const currentUser = await this.authService.getCurrentUser();
    if (!currentUser || !currentUser.id) {
      console.error('ID de conductor no disponible');
      return '';  // O lanza un error para manejarlo adecuadamente en la interfaz
    }
    return currentUser.id;
  }
  
  /**
   * Obtiene los viajes, filtrando por conductor si es necesario
   * @param driverId El ID del conductor para filtrar los viajes
   * @returns Un arreglo de viajes
   */
  async getTrips(driverId?: string): Promise<any[]> {
    // Asegúrate de tener los datos actualizados
    await this.loadTrips();
    return driverId ? this.trips.filter((trip) => trip.driverId === driverId) : this.trips;
  }
}
