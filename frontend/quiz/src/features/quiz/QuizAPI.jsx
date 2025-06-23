import { api } from '../../services/api';

export const getAllTests = () => api.get('tests/');
export const getTestById = (id) => api.get(`tests/${id}/`);
export const submitTestExecution = (data) => api.post('testexecutions/', data);