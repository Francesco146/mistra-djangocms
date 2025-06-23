import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8000/api/', // o 'http://web/api/' se da container
});