

// config/axiosConfig.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://ricardonajar.com/ApiSC/v1', // Reemplaza esto con la base URL de tu API
  timeout: 5000, // Tiempo máximo de espera para las peticiones (en milisegundos)
  headers: {
    'Content-Type': 'application/json',
    // Puedes agregar aquí otros encabezados que necesites para todas las peticiones
  },
});

export { instance };