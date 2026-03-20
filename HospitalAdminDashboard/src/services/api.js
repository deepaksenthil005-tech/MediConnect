import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api', // Backend base URL
});

// Request interceptor to add token
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
  // --- ADMIN AUTH ---
  register: async (data) => {
    const res = await api.post('/admin/register', data);
    return res.data;
  },
  login: async (data) => {
    const res = await api.post('/admin/login', data);
    return res.data;
  },

  // --- DASHBOARD ADMIN STATS ---
  getAdminStats: async () => {
    const res = await api.get('/stats');
    return res.data;
  },

  // --- PATIENTS ---
  getPatients: async () => {
    const res = await api.get('/patients');
    return res.data;
  },
  deletePatient: async (id) => {
    const res = await api.delete(`/patients/${id}`);
    return res.data;
  },

  // --- DOCTORS ---
  getDoctors: async () => {
    const res = await api.get('/doctors');
    return res.data;
  },
  addDoctor: async (data) => {
    const res = await api.post('/doctors', data);
    return res.data;
  },
  updateDoctor: async (id, data) => {
    const res = await api.put(`/doctors/${id}`, data);
    return res.data;
  },
  deleteDoctor: async (id) => {
    const res = await api.delete(`/doctors/${id}`);
    return res.data;
  },

  // --- APPOINTMENTS ---
  getAppointments: async () => {
    const res = await api.get('/appointments');
    return res.data;
  },
  updateAppointmentStatus: async (id, status) => {
    const res = await api.put(`/appointments/${id}/status`, { status });
    return res.data;
  },

  // --- FEEDBACK ---
  getFeedback: async () => {
    const res = await api.get('/feedback');
    return res.data;
  },

  // --- NOTIFICATIONS ---
  getNotifications: async () => {
    const res = await api.get('/notifications');
    return res.data;
  },
  sendNotification: async (data) => {
    const res = await api.post('/notifications', data);
    return res.data;
  },

  // --- HEALTH REPORTS ---
  getHealthReport: async (patientId) => {
    const res = await api.get(`/reports/${patientId}`);
    return res.data;
  },
  saveHealthReport: async (patientId, data) => {
    const res = await api.put(`/reports/${patientId}`, data);
    return res.data;
  },
  addMedicalRecord: async (patientId, data) => {
    const res = await api.post(`/reports/${patientId}/records`, data);
    return res.data;
  },

  // --- CONSULTATIONS ---
  getAllConsultations: async () => {
    const res = await api.get('/consultations');
    return res.data;
  },
  getConsultationMessages: async (patientId) => {
    const res = await api.get(`/consultations/${patientId}`);
    return res.data;
  },
  addConsultationMessage: async (patientId, data) => {
    const res = await api.post(`/consultations/${patientId}`, data);
    return res.data;
  }
};
