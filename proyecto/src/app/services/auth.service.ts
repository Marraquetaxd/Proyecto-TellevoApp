import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedIn = false;

  constructor(private storageService: StorageService) {
    this.checkLoginStatus();
  }

  // Verifica el estado de inicio de sesión
  async checkLoginStatus() {
    const isLoggedIn = await this.storageService.get('isLoggedIn');
    this.loggedIn = isLoggedIn === 'true';
  }

  async isAuthenticated(): Promise<boolean> {
    const isLoggedIn = await this.storageService.get('isLoggedIn');
    return isLoggedIn === 'true';
  }
  private generateUserId(): string {
    return 'user-' + Math.random().toString(36).substr(2, 9);  // Genera un ID único al azar
  }
  

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  // Iniciar sesión
  async login(username: string, password: string): Promise<boolean> {
    console.log('Intentando iniciar sesión con:', username);

    const storedUsers: any[] = (await this.storageService.get('users')) || [];
    const user = storedUsers.find(
      (user) => user.username === username && user.password === password
    );

    if (user) {
      this.loggedIn = true;
      await this.storageService.set('isLoggedIn', 'true');
      await this.storageService.set('currentUser', user);
      console.log('Inicio de sesión exitoso');
      return true;
    }

    console.log(
      'Error de inicio de sesión: usuario no encontrado o contraseña incorrecta'
    );
    return false;
  }

  // Cerrar sesión
  async logout(): Promise<void> {
    this.loggedIn = false;
    await this.storageService.remove('isLoggedIn');
    await this.storageService.remove('currentUser');
    console.log('Usuario ha cerrado sesión');
  }

  // Obtener usuario actual
  async getCurrentUser(): Promise<any> {
    const currentUser = await this.storageService.get('currentUser');
    if (!currentUser) {
      console.error('No se encontró el usuario actual');
      return null; // Si no se encuentra, devolvemos null
    }
    console.log('Usuario actual:', currentUser); // Verifica qué contiene el objeto
    return currentUser;
  }
  

  // Actualizar imagen de perfil
  async updateProfileImage(imageUrl: string): Promise<void> {
    const currentUser = await this.getCurrentUser();
    if (currentUser) {
      currentUser.profileImage = imageUrl;
      await this.storageService.set('currentUser', currentUser);
      console.log('Imagen de perfil actualizada');
    }
  }

  // Obtener todos los usuarios
  async getAllUsers(): Promise<any[]> {
    return (await this.storageService.get('users')) || [];
  }

  // Eliminar usuario
  async deleteUser(username: string): Promise<void> {
    const users = await this.getAllUsers();
    const updatedUsers = users.filter((user) => user.username !== username);
    await this.storageService.set('users', updatedUsers);
    console.log(`Usuario ${username} eliminado`);
  }

  // Actualizar usuario
  async updateUser(updatedUser: any): Promise<void> {
    const users = await this.getAllUsers();
    const currentUser = await this.getCurrentUser();

    const userIndex = users.findIndex(
      (user) => user.username === currentUser.username
    );

    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      await this.storageService.set('users', users);
      await this.storageService.set('currentUser', updatedUser);
      console.log('Información del usuario actualizada');
    } else {
      console.error('Error al actualizar: usuario no encontrado');
    }
  }

  // Registro de usuario
  async register(
    firstName: string,
    lastName: string,
    username: string,
    password: string,
    birthdate: string,
    tipo_usuario: string,
    vehicleDetails?: {
      vehicleBrand: string;
      vehicleModel: string;
      vehicleYear: number | null;
      vehiclePlate: string;
    }
  ): Promise<boolean> {
    const storedUsers = await this.getAllUsers();

    const existingUser = storedUsers.find(
      (user) => user.username === username
    );

    if (existingUser) {
      console.log('El nombre de usuario ya existe');
      return false;
    }

    const newUser: any = {
      id: this.generateUserId(),  // Generar un ID único
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      username,
      password,
      birthdate,
      tipo_usuario,
    };

    if (tipo_usuario === 'chofer' && vehicleDetails) {
      newUser.vehicleDetails = vehicleDetails;
    }

    storedUsers.push(newUser);
    await this.storageService.set('users', storedUsers);

    this.loggedIn = true;
    await this.storageService.set('isLoggedIn', 'true');
    await this.storageService.set('currentUser', newUser);

    console.log('Usuario registrado con éxito');
    return true;
  }

  // Actualizar detalles del vehículo
  async updateVehicleDetails(
    username: string,
    vehicleDetails: {
      vehicleBrand: string;
      vehicleModel: string;
      vehicleYear: number | null;
      vehiclePlate: string;
    }
  ): Promise<boolean> {
    const users = await this.getAllUsers();
    const userIndex = users.findIndex((user) => user.username === username);

    if (userIndex !== -1) {
      users[userIndex].vehicleDetails = vehicleDetails;
      await this.storageService.set('users', users);

      const currentUser = await this.getCurrentUser();
      if (currentUser && currentUser.username === username) {
        currentUser.vehicleDetails = vehicleDetails;
        await this.storageService.set('currentUser', currentUser);
      }

      console.log('Detalles del vehículo actualizados con éxito');
      return true;
    }

    console.log('Usuario no encontrado');
    return false;
  }

  // Obtener tipo de usuario actual
  async getCurrentUserType(): Promise<string> {
    const currentUser = await this.getCurrentUser();
    return currentUser?.tipo_usuario || '';
  }
}
