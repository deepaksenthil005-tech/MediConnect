import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

export const apiService = {
  register: async (data) => {
    const res = await api.post("/admin/register", data);
    return res.data;
  },

  login: async (data) => {
    const res = await api.post("/admin/login", data);
    return res.data;
  },

  getAdminStats: async () => {
    const res = await api.get("/stats");
    return res.data;
  },

  getPatients: async () => {
    const res = await api.get("/patients");
    return res.data;
  },

  deletePatient: async (id) => {
    const res = await api.delete(`/patients/${id}`);
    return res.data;
  },

  getDoctors: async () => {
    const res = await api.get("/doctors");
    return res.data;
  },

  addDoctor: async (data) => {
    const res = await api.post("/doctors", data);
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

  getAppointments: async () => {
    const res = await api.get("/appointments");
    return res.data;
  },

  updateAppointmentStatus: async (id, status) => {
    const res = await api.put(`/appointments/${id}/status`, { status });
    return res.data;
  },

  getFeedback: async () => {
    const res = await api.get("/feedback");
    return res.data;
  },

  getNotifications: async () => {
    const res = await api.get("/notifications");
    return res.data;
  },

  sendNotification: async (data) => {
    const res = await api.post("/notifications", data);
    return res.data;
  },

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

  getAllConsultations: async () => {
    const res = await api.get("/consultations");
    return res.data;
  },

  getConsultationMessages: async (patientId) => {
    const res = await api.get(`/consultations/${patientId}`);
    return res.data;
  },

  addConsultationMessage: async (patientId, data) => {
    const res = await api.post(`/consultations/${patientId}`, data);
    return res.data;
  },

  updateUser: async (id, data) => {
    const res = await api.put("/admin/profile", data);
    return res.data;
  },

  updateUserPhoto: async (id, imageUrl) => {
    const res = await api.put("/admin/profile", { imageUrl });
    return res.data;
  },

  getAdminProfile: async () => {
    const res = await api.get("/admin/me");
    return res.data;
  },
};