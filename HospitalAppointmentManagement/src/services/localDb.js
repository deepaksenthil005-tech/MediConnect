/**
 * Local storage-based database for Hospital Appointment Management.
 * Seeds initial doctors, users (admin), appointments, notifications, and feedback.
 */
import bcrypt from 'bcryptjs';

const INITIAL_DOCTORS = [
  { id: 1, name: 'Dr. Sarah Johnson', email: 'sarah@mediconnect.com', phone: '123-456-7890', experience: 12, qualification: 'MD, FACC', specialization: 'Cardiologist', availability: 'Mon-Sun, 08:00-20:00', bio: 'Expert in heart health and cardiovascular surgery.', image_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400', fee: 150, status: 'Available' },
  { id: 2, name: 'Dr. Michael Chen', email: 'michael@mediconnect.com', phone: '123-456-7891', experience: 8, qualification: 'MD, PhD', specialization: 'Neurologist', availability: 'Mon-Sun, 08:00-20:00', bio: 'Specializing in brain disorders and cognitive therapy.', image_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400', fee: 200, status: 'Available' },
  { id: 3, name: 'Dr. Emily White', email: 'emily@mediconnect.com', phone: '123-456-7892', experience: 15, qualification: 'MD, FAAP', specialization: 'Pediatrician', availability: 'Mon-Sun, 08:00-20:00', bio: 'Compassionate care for children and adolescents.', image_url: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=400', fee: 120, status: 'Available' },
  { id: 4, name: 'Dr. David Miller', email: 'david@mediconnect.com', phone: '123-456-7893', experience: 10, qualification: 'MD', specialization: 'General Physician', availability: 'Mon-Sun, 08:00-20:00', bio: 'Comprehensive primary care for adults.', image_url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400', fee: 100, status: 'Available' },
  { id: 5, name: 'Dr. Lisa Wong', email: 'lisa@mediconnect.com', phone: '123-456-7894', experience: 7, qualification: 'MD, FAAD', specialization: 'Dermatologist', availability: 'Mon-Sun, 08:00-20:00', bio: 'Specialist in skin, hair, and nail health.', image_url: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=400', fee: 180, status: 'Available' },
];

const STORAGE_KEYS = {
  USERS: 'mediconnect_users',
  DOCTORS: 'mediconnect_doctors',
  APPOINTMENTS: 'mediconnect_appointments',
  PASSWORD_RESETS: 'mediconnect_password_resets',
  NOTIFICATIONS: 'mediconnect_notifications',
  FEEDBACK: 'mediconnect_feedback',
  HEALTH_REPORTS: 'mediconnect_health_reports',
  CONSULTATIONS: 'mediconnect_consultations',
};

class LocalDb {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      const adminPassword = bcrypt.hashSync('admin123', 10);
      const userPassword = bcrypt.hashSync('user123', 10);
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([
        { id: 1, name: 'System Admin', email: 'admin@mediconnect.com', password: adminPassword, role: 'ADMIN', image_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
        { id: 2, name: 'Alice Thompson', email: 'alice@example.com', password: userPassword, role: 'USER', image_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
        { id: 3, name: 'Bob Harrison', email: 'bob@example.com', password: userPassword, role: 'USER', image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
        { id: 4, name: 'Charlie Davis', email: 'charlie@example.com', password: userPassword, role: 'USER', image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
        { id: 5, name: 'Diana Prince', email: 'diana@example.com', password: userPassword, role: 'USER', image_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' }
      ]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.DOCTORS)) {
      localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(INITIAL_DOCTORS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)) {
      const appointments = [];
      const statuses = ['COMPLETED', 'CONFIRMED', 'PENDING', 'CANCELLED'];
      const doctors = INITIAL_DOCTORS;
      for (let i = 0; i < 50; i++) {
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 30));
        const patientData = [
          { id: 2, name: 'Alice Thompson' },
          { id: 3, name: 'Bob Harrison' },
          { id: 4, name: 'Charlie Davis' },
          { id: 5, name: 'Diana Prince' }
        ];
        const p = patientData[i % 4];
        appointments.push({
          id: i + 1,
          patient_id: p.id,
          doctor_id: doctors[Math.floor(Math.random() * doctors.length)].id,
          patient_name: p.name,
          doctor_name: '',
          specialization: '',
          date: date.toISOString().split('T')[0],
          time: '10:00 AM',
          status: statuses[Math.floor(Math.random() * statuses.length)],
          reason: 'Regular checkup',
          created_at: date.toISOString()
        });
      }
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PASSWORD_RESETS)) {
      localStorage.setItem(STORAGE_KEYS.PASSWORD_RESETS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([
        { id: 1, title: 'System Update', message: 'The system will be down for maintenance on Sunday.', type: 'ANNOUNCEMENT', created_at: new Date().toISOString() },
        { id: 2, title: 'New Doctor Joined', message: 'Dr. Lisa Wong has joined the Dermatology department.', type: 'AVAILABILITY', created_at: new Date().toISOString() }
      ]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.FEEDBACK)) {
      localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify([
        { id: 1, patient_name: 'John Doe', doctor_name: 'Dr. Sarah Johnson', rating: 5, comment: 'Excellent service!', created_at: new Date().toISOString() },
        { id: 2, patient_name: 'Jane Smith', doctor_name: 'Dr. Michael Chen', rating: 4, comment: 'Very professional.', created_at: new Date().toISOString() }
      ]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.HEALTH_REPORTS)) {
      const defaultReports = [
        {
          patient_id: 2,
          weight: 72,
          height: 175,
          heartRate: 72,
          bloodOxygen: 98,
          stressLevel: 'Low',
          bmiHistory: [
            { label: 'Oct', value: 23.1 },
            { label: 'Nov', value: 23.3 },
            { label: 'Dec', value: 23.4 },
            { label: 'Jan', value: 23.5 },
            { label: 'Feb', value: 23.5 },
            { label: 'Mar', value: 23.6 },
          ],
          medicalRecords: [
            { id: 1, name: 'Blood_Test_Results.pdf', date: '2026-02-15', size: '1.2 MB' },
            { id: 2, name: 'X-Ray_Report.jpg', date: '2026-03-01', size: '2.5 MB' }
          ]
        },
      ];
      localStorage.setItem(STORAGE_KEYS.HEALTH_REPORTS, JSON.stringify(defaultReports));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CONSULTATIONS)) {
      // Seed with an empty array; messages will be appended per patient.
      localStorage.setItem(STORAGE_KEYS.CONSULTATIONS, JSON.stringify([]));
    }
  }

  async register(userData) {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    if (users.find((u) => u.email === userData.email)) {
      throw new Error('Email already exists');
    }
    const newUser = {
      ...userData,
      id: Date.now(),
      password: bcrypt.hashSync(userData.password, 10),
      role: userData.role || 'USER',
      created_at: new Date().toISOString(),
    };
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    const { password, ...userWithoutPassword } = newUser;
    return { user: userWithoutPassword, token: 'mock-jwt-token-' + newUser.id };
  }

  async login(credentials) {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const user = users.find((u) => u.email === credentials.email);
    if (!user || !bcrypt.compareSync(credentials.password, user.password)) {
      throw new Error('Invalid credentials');
    }
    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token: 'mock-jwt-token-' + user.id };
  }

  async updateUser(userId, userData) {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const index = users.findIndex((u) => u.id === userId);
    if (index !== -1) {
      users[index] = { ...users[index], ...userData };
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      const { password, ...userWithoutPassword } = users[index];
      return userWithoutPassword;
    }
    throw new Error('User not found');
  }

  async forgotPassword(email) {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const user = users.find((u) => u.email === email);
    if (!user) throw new Error('User not found');
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    const resets = JSON.parse(localStorage.getItem(STORAGE_KEYS.PASSWORD_RESETS) || '[]');
    const newResets = resets.filter((r) => r.email !== email);
    newResets.push({ email, otp, expires_at: expiresAt });
    localStorage.setItem(STORAGE_KEYS.PASSWORD_RESETS, JSON.stringify(newResets));
    return { otp };
  }

  async resetPassword(data) {
    const resets = JSON.parse(localStorage.getItem(STORAGE_KEYS.PASSWORD_RESETS) || '[]');
    const reset = resets.find((r) => r.email === data.email && r.otp === data.otp);
    if (!reset) throw new Error('Invalid OTP');
    if (new Date(reset.expires_at) < new Date()) throw new Error('OTP expired');
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const userIndex = users.findIndex((u) => u.email === data.email);
    if (userIndex === -1) throw new Error('User not found');
    users[userIndex].password = bcrypt.hashSync(data.newPassword, 10);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    const newResets = resets.filter((r) => r.email !== data.email);
    localStorage.setItem(STORAGE_KEYS.PASSWORD_RESETS, JSON.stringify(newResets));
    return { success: true };
  }

  async updateUserPhoto(userId, imageUrl) {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const index = users.findIndex((u) => u.id === userId);
    if (index !== -1) {
      users[index].image_url = imageUrl;
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      return { success: true };
    }
    return { success: false };
  }

  async getDoctors() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.DOCTORS) || '[]');
  }

  async addDoctor(doctorData) {
    const doctors = JSON.parse(localStorage.getItem(STORAGE_KEYS.DOCTORS) || '[]');
    const newDoctor = { ...doctorData, id: Date.now() };
    doctors.push(newDoctor);
    localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(doctors));
    return newDoctor;
  }

  async updateDoctor(id, doctorData) {
    const doctors = JSON.parse(localStorage.getItem(STORAGE_KEYS.DOCTORS) || '[]');
    const index = doctors.findIndex((d) => d.id === id);
    if (index !== -1) {
      doctors[index] = { ...doctors[index], ...doctorData };
      localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(doctors));
    }
    return doctors[index];
  }

  async deleteDoctor(id) {
    const doctors = JSON.parse(localStorage.getItem(STORAGE_KEYS.DOCTORS) || '[]');
    const newDoctors = doctors.filter((d) => d.id !== id);
    localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(newDoctors));
    return { success: true };
  }

  async getPatients() {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    return users.filter((u) => u.role === 'USER');
  }

  async deletePatient(id) {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const newUsers = users.filter((u) => u.id !== id);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(newUsers));
    return { success: true };
  }

  async getAppointments(userId, role) {
    const appointments = JSON.parse(localStorage.getItem(STORAGE_KEYS.APPOINTMENTS) || '[]');
    const doctors = await this.getDoctors();
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const enriched = appointments.map((a) => {
      const doctor = doctors.find((d) => d.id === a.doctor_id);
      const patient = users.find((u) => u.id === a.patient_id);
      return {
        ...a,
        doctor_name: doctor?.name || 'Unknown Doctor',
        specialization: doctor?.specialization || 'General',
        patient_name: patient?.name || a.patient_name || 'Unknown Patient'
      };
    });
    if (role === 'ADMIN' || !userId) return enriched;
    return enriched.filter((a) => a.patient_id === userId);
  }

  async createAppointment(data) {
    const appointments = JSON.parse(localStorage.getItem(STORAGE_KEYS.APPOINTMENTS) || '[]');
    const newAppointment = {
      ...data,
      id: Date.now(),
      status: 'PENDING',
      created_at: new Date().toISOString()
    };
    appointments.push(newAppointment);
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
    return newAppointment;
  }

  async updateAppointmentStatus(id, status) {
    const appointments = JSON.parse(localStorage.getItem(STORAGE_KEYS.APPOINTMENTS) || '[]');
    const index = appointments.findIndex((a) => a.id === id);
    if (index !== -1) {
      appointments[index].status = status;
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
    }
    return { success: true };
  }

  async updateAppointment(id, data) {
    const appointments = JSON.parse(localStorage.getItem(STORAGE_KEYS.APPOINTMENTS) || '[]');
    const index = appointments.findIndex((a) => a.id === id);
    if (index !== -1) {
      appointments[index] = { ...appointments[index], ...data };
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
      return appointments[index];
    }
    return null;
  }

  async getNotifications() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]');
  }

  async sendNotification(data) {
    const notifications = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]');
    const newNotification = { ...data, id: Date.now(), created_at: new Date().toISOString() };
    notifications.push(newNotification);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    return newNotification;
  }

  async getFeedback() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.FEEDBACK) || '[]');
  }

  async submitFeedback(feedbackData) {
    const allFeedback = JSON.parse(localStorage.getItem(STORAGE_KEYS.FEEDBACK) || '[]');
    const newItem = {
      ...feedbackData,
      id: Date.now(),
      created_at: new Date().toISOString()
    };
    allFeedback.push(newItem);
    localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(allFeedback));
    return newItem;
  }

  async getHealthReport(patientId) {
    const reports = JSON.parse(localStorage.getItem(STORAGE_KEYS.HEALTH_REPORTS) || '[]');
    let report = reports.find((r) => r.patient_id === patientId);
    if (!report) {
      // Fallback: create a simple default for new patients
      const newReport = {
        patient_id: patientId,
        weight: 72,
        height: 175,
        heartRate: 72,
        bloodOxygen: 98,
        stressLevel: 'Low',
          bmiHistory: [
            { label: 'Jan', value: 23.1 },
            { label: 'Feb', value: 23.3 },
            { label: 'Mar', value: 23.5 },
          ],
          medicalRecords: []
        };
      reports.push(newReport);
      localStorage.setItem(STORAGE_KEYS.HEALTH_REPORTS, JSON.stringify(reports));
      report = newReport;
    }
    return report;
  }

  async saveHealthReport(patientId, data) {
    const reports = JSON.parse(localStorage.getItem(STORAGE_KEYS.HEALTH_REPORTS) || '[]');
    const index = reports.findIndex((r) => r.patient_id === patientId);
    if (index === -1) {
      reports.push({ patient_id: patientId, medicalRecords: [], ...data });
    } else {
      reports[index] = { ...reports[index], ...data };
    }
    localStorage.setItem(STORAGE_KEYS.HEALTH_REPORTS, JSON.stringify(reports));
    return { success: true };
  }

  async addMedicalRecord(patientId, record) {
    const reports = JSON.parse(localStorage.getItem(STORAGE_KEYS.HEALTH_REPORTS) || '[]');
    const index = reports.findIndex((r) => r.patient_id === patientId);
    if (index !== -1) {
      if (!reports[index].medicalRecords) reports[index].medicalRecords = [];
      const newRecord = { ...record, id: Date.now(), date: new Date().toISOString().split('T')[0] };
      reports[index].medicalRecords.push(newRecord);
      localStorage.setItem(STORAGE_KEYS.HEALTH_REPORTS, JSON.stringify(reports));
      return newRecord;
    }
    return null;
  }

  async getConsultationMessages(patientId) {
    const threads = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONSULTATIONS) || '[]');
    const thread = threads.find((t) => t.patient_id === patientId);
    return thread?.messages || [];
  }

  async addConsultationMessage(patientId, message) {
    const threads = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONSULTATIONS) || '[]');
    let thread = threads.find((t) => t.patient_id === patientId);
    if (!thread) {
      thread = { patient_id: patientId, messages: [] };
      threads.push(thread);
    }
    thread.messages.push({ ...message, id: Date.now(), created_at: new Date().toISOString() });
    localStorage.setItem(STORAGE_KEYS.CONSULTATIONS, JSON.stringify(threads));
    return thread.messages[thread.messages.length - 1];
  }

  async getAllConsultations() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CONSULTATIONS) || '[]');
  }

  async getAdminStats() {
    const doctors = await this.getDoctors();
    const patients = await this.getPatients();
    const appointments = await this.getAppointments();
    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = appointments.filter((a) => a.date === today);
    const pendingAppointments = appointments.filter((a) => a.status === 'PENDING');
    const completedAppointments = appointments.filter((a) => a.status === 'COMPLETED');
    const cancelledAppointments = appointments.filter((a) => a.status === 'CANCELLED');
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();
    const appointmentsPerDay = last7Days.map(date => ({
      name: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      count: appointments.filter((a) => a.date === date).length
    }));
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyAppointments = months.map((month, i) => ({
      name: month,
      count: appointments.filter((a) => new Date(a.date).getMonth() === i).length
    }));
    const doctorWise = doctors.map((d) => ({
      doctor: d.name,
      count: appointments.filter((a) => a.doctor_id === d.id).length
    })).filter((d) => d.count > 0);
    return {
      totalDoctors: doctors.length,
      totalPatients: patients.length,
      todayAppointments: todayAppointments.length,
      pendingAppointments: pendingAppointments.length,
      completedAppointments: completedAppointments.length,
      cancelledAppointments: cancelledAppointments.length,
      appointmentsPerDay,
      monthlyAppointments,
      doctorWiseAppointments: doctorWise,
      recentAppointments: appointments.slice(-5).reverse()
    };
  }
}

export const localDb = new LocalDb();
