import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Location } from '@angular/common';
import { App } from '@capacitor/app';  // Importa el plugin de Capacitor

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private platform: Platform, private location: Location) {}

  ngOnInit() {
    this.platform.ready().then(() => {
      this.platform.backButton.subscribeWithPriority(10, () => {
        this.handleBackButton();
      });
    });
  }

  handleBackButton() {
    const currentUrl = window.location.pathname;

    if (currentUrl === '/home') {
      if (window.confirm('¿Seguro que quieres salir de la aplicación?')) {
        // Usar Capacitor para salir de la aplicación
        App.exitApp(); // Salir de la app usando Capacitor
      }
    } else {
      this.location.back();
    }
  }
}
