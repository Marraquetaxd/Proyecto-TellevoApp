import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tuapp.id',      // ID único de la aplicación
  appName: 'TuApp',           // Nombre de la aplicación
  webDir: 'www',              // Directorio donde se almacenan los archivos web generados
  bundledWebRuntime: false,   // Usar el runtime de Capacitor incluido o no
  server: {
    cleartext: true,          // Permite conexiones HTTP no seguras (útil para pruebas locales)
    androidScheme: 'http',    // Esquema para cargar recursos en HTTP
  }
};

export default config;
