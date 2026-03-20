import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Backend base URL
});

// Request interceptor to add token and handle separate auth models
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const apiService = {
  // --- PATIENT AUTH ---
  register: async (data) => {
    const res = await api.post('/patient/register', data);
    return res.data;
  },
  login: async (data) => {
    const res = await api.post('/patient/login', data);
    return res.data;
  },

  // --- DOCTORS ---
  getDoctors: async () => {
    const res = await api.get('/doctors');
    return res.data;
  },

  // --- APPOINTMENTS ---
  getAppointments: async () => {
    const res = await api.get('/appointments');
    return res.data;
  },
  createAppointment: async (data) => {
    const res = await api.post('/appointments', data);
    return res.data;
  },

  // --- FEEDBACK ---
  getFeedback: async () => {
    const res = await api.get('/feedback');
    return res.data;
  },
  submitFeedback: async (data) => {
    const res = await api.post('/feedback', data);
    return res.data;
  },

  // --- NOTIFICATIONS ---
  getNotifications: async () => {
    const res = await api.get('/notifications');
    return res.data;
  },

  // --- HEALTH REPORTS ---
  getHealthReport: async (patientId) => {
    const res = await api.get(`/reports/${patientId}`);
    return res.data;
  },

  // --- CONSULTATIONS ---
  getConsultationMessages: async (patientId) => {
    const res = await api.get(`/consultations/${patientId}`);
    return res.data;
  },
  addConsultationMessage: async (patientId, data) => {
    const res = await api.post(`/consultations/${patientId}`, data);
    return res.data;
  }
};
