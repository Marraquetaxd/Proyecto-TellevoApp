import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'; // Adaptado al servicio que mencionaste

@Injectable({
  providedIn: 'root',
})
export class APIControllerService {
  // Configuración de la URL de la API a consumir
  apiURL = 'http://localhost:3000';

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Verifica si el usuario está autenticado antes de realizar solicitudes
  private async isAuthenticated(): Promise<boolean> {
    return await this.authService.isAuthenticated(); // Llama al método del servicio AuthenticatorService
  }

  // Obtener todos los usuarios
  async getUsers(): Promise<Observable<any>> {
    const isLoggedIn = await this.isAuthenticated();
    if (isLoggedIn) {
      return this.http.get(this.apiURL + '/users');
    } else {
      console.error('Error: No está autenticado');
      throw new Error('No está autenticado');
    }
  }

  // Registrar un nuevo usuario
  async postUser(data: any): Promise<Observable<any>> {
    const isLoggedIn = await this.isAuthenticated();
    if (isLoggedIn) {
      return this.http.post(this.apiURL + '/users', data);
    } else {
      console.error('Error: No está autenticado');
      throw new Error('No está autenticado');
    }
  }

  // Actualizar la información de un usuario existente
  async updateUser(id: string, data: any): Promise<Observable<any>> {
    const isLoggedIn = await this.isAuthenticated();
    if (isLoggedIn) {
      return this.http.put(this.apiURL + '/users/' + id, data);
    } else {
      console.error('Error: No está autenticado');
      throw new Error('No está autenticado');
    }
  }

  // Eliminar un usuario por su ID
  async deleteUser(id: string): Promise<Observable<any>> {
    const isLoggedIn = await this.isAuthenticated();
    if (isLoggedIn) {
      return this.http.delete(this.apiURL + '/users/' + id);
    } else {
      console.error('Error: No está autenticado');
      throw new Error('No está autenticado');
    }
  }
}
