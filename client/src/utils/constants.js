export const SPECIALIZATIONS = [
  'Cardiology',
  'Dermatology',
  'Pediatrics',
  'Neurology',
  'Orthopedics',
  'Psychiatry',
  'General Medicine',
  'Gynecology',
  'Dentistry',
  'Ophthalmology',
  'ENT',
  'Oncology'
]

export const APPOINTMENT_TYPES = [
  'Consultation',
  'Follow-up',
  'Emergency',
  'Routine Check-up'
]

export const APPOINTMENT_STATUS = [
  'Pending',
  'Confirmed',
  'Completed',
  'Cancelled',
  'No-Show'
]

export const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

export const GENDERS = ['Male', 'Female', 'Other']

export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
]

export const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'
]

export const SEVERITY_LEVELS = ['Mild', 'Moderate', 'Severe']

export const MEDICAL_RECORD_TYPES = [
  'Lab Report',
  'X-Ray',
  'MRI',
  'CT Scan',
  'Prescription',
  'Discharge Summary',
  'Other'
]

export const PAYMENT_METHODS = ['Cash', 'Card', 'Insurance', 'Online', 'Other']

export const PAYMENT_STATUS = ['Pending', 'Paid', 'Partially Paid', 'Overdue', 'Cancelled']

export const ROLES = {
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  PATIENT: 'patient'
}


export const API_ENDPOINTS = {
  AUTH: '/auth',
  DOCTORS: '/doctors',
  PATIENTS: '/patients',
  APPOINTMENTS: '/appointments',
  DASHBOARD: '/dashboard'
}