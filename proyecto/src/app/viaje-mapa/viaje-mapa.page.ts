import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TripsService } from '../services/trip.service';
import mapboxgl from 'mapbox-gl';
import { environment } from '../../environments/environment';
import { FeatureCollection, LineString } from 'geojson';

@Component({
  selector: 'app-viaje-mapa',
  templateUrl: './viaje-mapa.page.html',
  styleUrls: ['./viaje-mapa.page.scss'],
})
export class ViajeMapaPage implements OnInit {
  trip: any;
  map!: mapboxgl.Map;

  constructor(
    private route: ActivatedRoute,
    private tripsService: TripsService
  ) {}

  ngOnInit() {
    const tripId = this.route.snapshot.paramMap.get('tripId'); // Obtener el tripId
    console.log('Trip ID obtenido:', tripId); // Depuración

    if (tripId) {
      this.loadTrip(tripId);
    } else {
      console.error('ID de viaje no disponible');
    }
  }

  async loadTrip(tripId: string) {
    const trips = await this.tripsService.getTrips();
    console.log('Lista de viajes:', trips); // Depuración

    // Comparar tripId como string para asegurar coincidencia
    this.trip = trips.find((t) => t.id.toString() === tripId);

    if (this.trip) {
      console.log('Viaje encontrado:', this.trip); // Depuración
      this.showMap();
    } else {
      console.error('Viaje no encontrado');
    }
  }

  showMap() {
    if (this.trip) {
      const { origin, destination } = this.trip;

      mapboxgl.accessToken = environment.mapboxToken;
      this.map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [origin.lng, origin.lat],
        zoom: 12,
      });

      new mapboxgl.Marker()
        .setLngLat([origin.lng, origin.lat])
        .setPopup(new mapboxgl.Popup().setHTML('<h3>Origen</h3>'))
        .addTo(this.map);

      new mapboxgl.Marker()
        .setLngLat([destination.lng, destination.lat])
        .setPopup(new mapboxgl.Popup().setHTML('<h3>Destino</h3>'))
        .addTo(this.map);

      this.showRoute([origin.lng, origin.lat], [destination.lng, destination.lat]);
    }
  }

  showRoute(originCoords: [number, number], destinationCoords: [number, number]) {
    this.getRoute(originCoords, destinationCoords);
  }

  getRoute(origin: [number, number], destination: [number, number]) {
    const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin.join(',')};${destination.join(',')}?geometries=geojson&access_token=${environment.mapboxToken}`;

    fetch(directionsUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0].geometry.coordinates;
          const routeGeoJSON: FeatureCollection<LineString> = {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                properties: {},
                geometry: { type: 'LineString', coordinates: route },
              },
            ],
          };

          if (!this.map.getSource('route')) {
            this.map.addSource('route', { type: 'geojson', data: routeGeoJSON });
            this.map.addLayer({
              id: 'route',
              type: 'line',
              source: 'route',
              layout: { 'line-join': 'round', 'line-cap': 'round' },
              paint: { 'line-color': '#1db7dd', 'line-width': 4 },
            });
          } else {
            const routeSource = this.map.getSource('route') as mapboxgl.GeoJSONSource;
            routeSource.setData(routeGeoJSON);
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
}
