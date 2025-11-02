import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Calendar,
  Activity,
  FileText,
  Heart,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import Sidebar from '../components/common/Sidebar'
import Navbar from '../components/common/Navbar'
import Card from '../components/common/Card'
import Loader from '../components/common/Loader'
import { dashboardAPI, appointmentAPI, doctorAPI } from '../services/api'
import { formatDate, formatTime, getRelativeDate } from '../utils/helpers'
import toast from 'react-hot-toast'

const PatientDashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="patient" />
      <div className="flex-1">
        <Navbar />
        <div className="p-8">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
            <Route path="/doctors" element={<DoctorsPage />} />
            <Route path="/records" element={<RecordsPage />} />
            <Route path="/billing" element={<BillingPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

// Dashboard Home Component
const DashboardHome = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const { data } = await dashboardAPI.getPatientStats()
      setStats(data.data)
    } catch (error) {
      console.error('Error fetching stats:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loader />

  const statCards = [
    {
      title: 'Total Appointments',
      value: stats?.totalAppointments || 0,
      icon: Calendar,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Upcoming',
      value: stats?.upcomingAppointments?.length || 0,
      icon: Clock,
      color: 'bg-green-500',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Heart Rate',
      value: stats?.vitalSigns?.[0]?.heartRate || '--',
      icon: Heart,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      suffix: ' bpm'
    },
    {
      title: 'Health Score',
      value: '85',
      icon: Activity,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      suffix: '/100'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-medical text-white rounded-2xl p-8 shadow-lg"
      >
        <h1 className="text-3xl font-bold mb-2">Welcome to Your Dashboard</h1>
        <p className="text-lg opacity-90">Track your health and manage your appointments</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover className={stat.bgColor}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold mb-2">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stat.value}{stat.suffix || ''}
                    </p>
                  </div>
                  <div className={`${stat.color} p-4 rounded-xl`}>
                    <Icon className="text-white" size={28} />
                  </div>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Upcoming Appointments */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Upcoming Appointments</h2>
          <button className="text-primary-500 hover:text-primary-600 font-semibold">
            View All
          </button>
        </div>

        {stats?.upcomingAppointments?.length > 0 ? (
          <div className="space-y-4">
            {stats.upcomingAppointments.slice(0, 3).map((appointment) => (
              <motion.div
                key={appointment._id}
                whileHover={{ x: 5 }}
                className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
              >
                <img
                  src={appointment.doctorId?.userId?.profilePicture}
                  alt={appointment.doctorId?.userId?.firstName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-primary-500"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    Dr. {appointment.doctorId?.userId?.firstName} {appointment.doctorId?.userId?.lastName}
                  </h3>
                  <p className="text-sm text-gray-600">{appointment.doctorId?.specialization}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm text-gray-500 flex items-center space-x-1">
                      <Calendar size={14} />
                      <span>{formatDate(appointment.appointmentDate)}</span>
                    </span>
                    <span className="text-sm text-gray-500 flex items-center space-x-1">
                      <Clock size={14} />
                      <span>{formatTime(appointment.timeSlot.startTime)}</span>
                    </span>
                  </div>
                </div>
                <span className={`badge ${
                  appointment.status === 'Confirmed' ? 'badge-confirmed' : 'badge-pending'
                }`}>
                  {appointment.status}
                </span>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="mx-auto mb-4 text-gray-400" size={48} />
            <p>No upcoming appointments</p>
          </div>
        )}
      </Card>

      {/* Health Metrics */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {stats?.recentAppointments?.slice(0, 3).map((appointment, index) => (
              <div key={index} className="flex items-center space-x-3">
                <CheckCircle className="text-green-500" size={20} />
                <div>
                  <p className="font-semibold text-gray-900">Appointment Completed</p>
                  <p className="text-sm text-gray-500">
                    Dr. {appointment.doctorId?.userId?.firstName} - {formatDate(appointment.appointmentDate)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-xl font-bold text-gray-900 mb-6">Health Tips</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Heart className="text-red-500 mt-1" size={20} />
              <div>
                <p className="font-semibold text-gray-900">Stay Hydrated</p>
                <p className="text-sm text-gray-600">Drink at least 8 glasses of water daily</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Activity className="text-green-500 mt-1" size={20} />
              <div>
                <p className="font-semibold text-gray-900">Regular Exercise</p>
                <p className="text-sm text-gray-600">30 minutes of activity, 5 days a week</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <AlertCircle className="text-yellow-500 mt-1" size={20} />
              <div>
                <p className="font-semibold text-gray-900">Regular Checkups</p>
                <p className="text-sm text-gray-600">Schedule annual health screenings</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

// Appointments Page Component
const AppointmentsPage = () => {
  return (
    <Card>
      <h2 className="text-2xl font-bold mb-6">My Appointments</h2>
      <p className="text-gray-600">Appointments management coming soon...</p>
    </Card>
  )
}

// Doctors Page Component
const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDoctors()
  }, [])

  const fetchDoctors = async () => {
    try {
      const { data } = await doctorAPI.getAll()
      setDoctors(data.data)
    } catch (error) {
      console.error('Error fetching doctors:', error)
      toast.error('Failed to load doctors')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loader />

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Find Doctors</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor) => (
          <Card key={doctor._id} hover>
            <img
              src={doctor.userId?.profilePicture}
              alt={doctor.userId?.firstName}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Dr. {doctor.userId?.firstName} {doctor.userId?.lastName}
            </h3>
            <p className="text-primary-500 font-semibold mb-2">{doctor.specialization}</p>
            <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
              <span>⭐ {doctor.rating}</span>
              <span>{doctor.experience}+ years exp</span>
            </div>
            <button className="btn-primary w-full">Book Appointment</button>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Records Page Component
const RecordsPage = () => {
  return (
    <Card>
      <h2 className="text-2xl font-bold mb-6">Medical Records</h2>
      <p className="text-gray-600">Medical records management coming soon...</p>
    </Card>
  )
}

// Billing Page Component
const BillingPage = () => {
  return (
    <Card>
      <h2 className="text-2xl font-bold mb-6">Billing & Payments</h2>
      <p className="text-gray-600">Billing management coming soon...</p>
    </Card>
  )
}

// Profile Page Component
const ProfilePage = () => {
  return (
    <Card>
      <h2 className="text-2xl font-bold mb-6">My Profile</h2>
      <p className="text-gray-600">Profile management coming soon...</p>
    </Card>
  )
}

export default PatientDashboard