import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8000/api/', // o 'http://web/api/' se da container
});

// 1. Recupera tutti i quiz (Test)
export async function fetchTests() {
  const response = await api.get('tests/');
  return response.data;
}

// 2. Recupera un quiz specifico con le sue domande
export async function fetchTest(id) {
  const response = await api.get(`tests/${id}/`);
  return response.data;
}

// 3. Invia l'esecuzione del test (risultati)
export async function submitTestExecution(payload) {
  const response = await api.post('testexecutions/', payload);
  return response.data;
}