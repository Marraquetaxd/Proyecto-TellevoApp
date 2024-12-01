import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ajustes',
  templateUrl: './ajustes.page.html',
  styleUrls: ['./ajustes.page.scss'],
})
export class AjustesPage implements OnInit {

  isDarkMode = false;

  constructor() { }

  ngOnInit() { }

  // Función para alternar entre modo oscuro y claro
  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark-mode', this.isDarkMode);
    document.body.classList.toggle('light-mode', !this.isDarkMode);
  }

  // Función para abrir el video de YouTube
  openVideo() {
    window.open('https://www.youtube.com/watch?v=L8XbI9aJOXk', '_blank');
  }
}