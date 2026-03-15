# Hospital Appointment Management (MediConnect)

A **React JSX** single-page application for managing hospital appointments. Patients can browse doctors, book appointments, and view their dashboard. Admins can manage doctors, patients, appointments, view reports, send notifications, and handle feedback.

---

## Project Overview

- **Stack:** React 19, React Router 7, Vite 6, Tailwind CSS 4, Motion (animations), Recharts (charts), Lucide React (icons)
- **Data:** In-browser only (localStorage) via `localDb.js` — no backend server required for demo
- **Auth:** Simple role-based (USER = Patient, ADMIN = Hospital Admin) with login/register and forgot-password (OTP demo)

---

## Folder Structure

```
src/
├── main.jsx              # App entry; mounts React root
├── App.jsx                # Router, layout (Header/Footer), public & protected routes
├── index.css              # Tailwind + custom utility classes
│
├── context/
│   └── AuthContext.jsx    # Auth state (user, token, login, logout)
│
├── components/
│   ├── Header.jsx         # Main site nav, login/register, user menu
│   ├── Footer.jsx         # Site footer and contact info
│   ├── ProtectedRoute.jsx # Guards routes by role (USER / ADMIN)
│   ├── AdminLayout.jsx    # Admin sidebar + top bar wrapper
│   └── DoctorCard.jsx     # Doctor card (image, name, specialty, fee, Book)
│
├── pages/
│   ├── Home.jsx           # Landing (hero, stats, featured doctors) or post-login quick links
│   ├── Login.jsx          # Login (Patient / Admin toggle)
│   ├── Register.jsx       # Register (Patient / Admin)
│   ├── ForgotPassword.jsx # Request OTP → reset password
│   ├── Doctors.jsx        # List doctors with search and specialty filter
│   ├── About.jsx          # About MediConnect
│   ├── Services.jsx       # Services overview
│   ├── Reviews.jsx        # Patient reviews
│   ├── PatientDashboard.jsx  # Patient: my appointments, quick stats
│   ├── AdminDashboard.jsx    # Admin: stats cards, charts, recent appointments
│   └── admin/
│       ├── DoctorsManagement.jsx     # CRUD doctors
│       ├── PatientsManagement.jsx   # List patients, view details & history
│       ├── AppointmentsManagement.jsx # List/filter appointments, update status
│       ├── Reports.jsx    # Analytics (revenue, appointments)
│       ├── Notifications.jsx # Send and list notifications
│       ├── Feedback.jsx   # Patient feedback list
│       └── Settings.jsx   # Admin profile, security, notification prefs
│
└── services/
    └── localDb.js         # localStorage DB: users, doctors, appointments, notifications, feedback
```

---

## How to Run

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start dev server**
   ```bash
   npm run dev
   ```
   Open the URL shown (e.g. `http://localhost:5173`).

3. **Build for production**
   ```bash
   npm run build
   ```
   Output is in `dist/`. Preview with:
   ```bash
   npm run preview
   ```

---

## Default Login (Demo)

- **Admin:**  
  - Email: `admin@mediconnect.com`  
  - Password: `admin123`  
  - Use “Hospital Admin” on login and you’ll land in the admin area.

- **Patient:**  
  - Register a new account with “Patient” selected, or use any user created via Register.

---

## Main Features

| Area | Description |
|------|-------------|
| **Public** | Home, Doctors (search/filter), About, Services, Reviews, Login, Register, Forgot password |
| **Patient** | Dashboard (appointments, quick stats), book via Doctors page |
| **Admin** | Dashboard (stats + charts), Doctors CRUD, Patients list + details, Appointments (status updates), Reports, Notifications, Feedback, Settings |

---

## Routes Summary

| Path | Access | Page |
|------|--------|------|
| `/` | Public | Home |
| `/doctors` | Public | Doctors list |
| `/login` | Public | Login |
| `/register` | Public | Register |
| `/forgot-password` | Public | Forgot / reset password |
| `/about`, `/services`, `/reviews` | Public | About, Services, Reviews |
| `/dashboard` | Patient only | Patient dashboard |
| `/admin` | Admin only | Admin dashboard |
| `/admin/doctors` | Admin | Doctors management |
| `/admin/patients` | Admin | Patients management |
| `/admin/appointments` | Admin | Appointments management |
| `/admin/reports` | Admin | Reports |
| `/admin/notifications` | Admin | Notifications |
| `/admin/feedback` | Admin | Feedback |
| `/admin/settings` | Admin | Settings |

---

## Tech Notes

- **No TypeScript:** The project uses plain JavaScript (JSX) only; all previous `.ts`/`.tsx` files were converted to `.js`/`.jsx`.
- **Data persistence:** Everything is stored in the browser’s `localStorage` (keys prefixed with `mediconnect_*`). Clearing site data will reset the app to initial seed data.
- **Styling:** Tailwind CSS with custom classes in `index.css` (e.g. `btn-primary`).

This README should be enough to understand the project, run it, and navigate the codebase.
