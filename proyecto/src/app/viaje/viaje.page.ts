import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as mapboxgl from 'mapbox-gl';
import { environment } from '../../environments/environment';
import { TripsService } from '../services/trip.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular'; // Asegúrate de importar NavController
import { Geolocation } from '@capacitor/geolocation'; // Importa Geolocation de Capacitor

@Component({
  selector: 'app-viaje',
  templateUrl: './viaje.page.html',
  styleUrls: ['./viaje.page.scss'],
})
export class ViajePage implements OnInit {
  public tripForm: FormGroup;
  public map!: mapboxgl.Map;
  public originSuggestions: any[] = [];
  public destinationSuggestions: any[] = [];
  public originCoords: [number, number] | null = null;
  public destinationCoords: [number, number] | null = null;

  constructor(
    private navCtrl: NavController,
    private formBuilder: FormBuilder,
    private tripsService: TripsService,
    private alertController: AlertController,
    private router: Router
  ) {
    this.tripForm = this.formBuilder.group({
      origen: ['', Validators.required],
      destino: ['', Validators.required],
      fecha: ['', Validators.required],
      costo: [0, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit() {
    (mapboxgl as any).accessToken = environment.mapboxToken;
    this.getCurrentPosition(); // Usar Capacitor para obtener ubicación
    this.initMap(); // Iniciar el mapa después
  }

  goBack() {
    this.navCtrl.back(); // Esto hará que el usuario regrese a la página anterior
  }

  // Obtener la ubicación del usuario usando Capacitor
  async getCurrentPosition() {
    try {
      const position = await Geolocation.getCurrentPosition();
      const userCoords: [number, number] = [
        position.coords.longitude,
        position.coords.latitude,
      ];

      this.map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: userCoords,
        zoom: 12,
        accessToken: environment.mapboxToken,
      });

      new mapboxgl.Marker().setLngLat(userCoords).addTo(this.map);
      console.log('Ubicación obtenida:', userCoords);
    } catch (error) {
      console.error('Error al obtener la ubicación con Capacitor:', error);
    }
  }

  // Inicializar el mapa (método anterior)
  initMap() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userCoords: [number, number] = [
          position.coords.longitude,
          position.coords.latitude,
        ];

        this.map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/streets-v11',
          center: userCoords,
          zoom: 12,
          accessToken: environment.mapboxToken,
        });

        new mapboxgl.Marker().setLngLat(userCoords).addTo(this.map);
      },
      (error) => console.error('Error al obtener ubicación:', error)
    );
  }

  // Buscar ubicaciones basadas en el texto ingresado
  searchLocations(query: string, type: 'origin' | 'destination') {
    if (query.length < 3) return;

    const geocodingUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      query
    )}.json?access_token=${environment.mapboxToken}&autocomplete=true&limit=5&country=CL`;

    fetch(geocodingUrl)
      .then((response) => response.json())
      .then((data) => {
        if (type === 'origin') {
          this.originSuggestions = data.features;
        } else {
          this.destinationSuggestions = data.features;
        }
      })
      .catch((error) => console.error('Error al buscar ubicaciones:', error));
  }

  // Seleccionar una ubicación del listado de sugerencias
  selectLocation(feature: any, type: 'origin' | 'destination') {
    const coords: [number, number] = feature.geometry.coordinates;
    const placeName: string = feature.place_name;

    if (type === 'origin') {
      this.originCoords = coords;
      this.tripForm.patchValue({ origen: placeName });
      this.originSuggestions = [];
    } else {
      this.destinationCoords = coords;
      this.tripForm.patchValue({ destino: placeName });
      this.destinationSuggestions = [];
    }
  }

  // Crear un viaje basado en los datos ingresados
  async onSubmit() {
    if (this.tripForm.valid && this.originCoords && this.destinationCoords) {
      const tripData = {
        ...this.tripForm.value,
        originCoords: this.originCoords,
        destinationCoords: this.destinationCoords,
        driverId: await this.tripsService.getCurrentDriverId(),
      };

      this.tripsService
        .createTrip(tripData)
        .then(async () => {
          const alert = await this.alertController.create({
            header: '¡Éxito!',
            message: 'El viaje se ha creado correctamente.',
            buttons: [
              {
                text: 'Aceptar',
                handler: () => {
                  this.router.navigate(['/home']);
                },
              },
            ],
          });

          await alert.present();
        })
        .catch((error) => console.error('Error al guardar el viaje:', error));
    } else {
      console.error('Formulario inválido o coordenadas incompletas');
    }
  }
  
  // Obtener y mostrar la ruta en el mapa
  getRoute(origen: [number, number], destino: [number, number]) {
    const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${origen.join(',')};${destino.join(',')}?geometries=geojson&access_token=${environment.mapboxToken}`;

    fetch(directionsUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0].geometry.coordinates;

          const routeSource = {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: route,
              },
            },
          };

          if (this.map.getSource('route')) {
            (this.map.getSource('route') as mapboxgl.GeoJSONSource).setData(
              routeSource.data as any
            );
          } else {
            this.map.addSource('route', routeSource as any);
            this.map.addLayer({
              id: 'route',
              type: 'line',
              source: 'route',
              layout: {
                'line-join': 'round',
                'line-cap': 'round',
              },
              paint: {
                'line-color': '#1db7dd',
                'line-width': 4,
              },
            });
          }

          this.map.fitBounds(
            route.reduce(
              (bounds: mapboxgl.LngLatBounds, coord: [number, number]) =>
                bounds.extend(coord),
              new mapboxgl.LngLatBounds(route[0], route[0])
            ),
            { padding: 50 }
          );
        } else {
          console.error('No se pudo obtener la ruta.');
        }
      })
      .catch((error) => console.error('Error al obtener la ruta:', error));
  }

  // Manejar entrada de texto
  handleInput(value: any, type: 'origin' | 'destination') {
    const inputValue = value ? String(value) : '';
    this.searchLocations(inputValue, type);
  }

  // Mostrar la ruta en el mapa
  showRoute() {
    if (this.originCoords && this.destinationCoords) {
      this.getRoute(this.originCoords, this.destinationCoords);
    } else {
      console.error('Coordenadas de origen o destino incompletas');
    }
  }

  // Alternar el tamaño del mapa
  toggleMapSize() {
    const mapContainer = document.getElementById('map-container');
    if (mapContainer) {
      if (mapContainer.classList.contains('map-normal')) {
        mapContainer.classList.replace('map-normal', 'map-expanded');
      } else {
        mapContainer.classList.replace('map-expanded', 'map-normal');
      }
      setTimeout(() => this.map.resize(), 300);
    }
  }
}
