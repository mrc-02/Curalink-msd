import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Calendar,
  Users,
  Clock,
  DollarSign,
  TrendingUp,
  Activity
} from 'lucide-react'
import Sidebar from '../components/common/Sidebar'
import Navbar from '../components/common/Navbar'
import Card from '../components/common/Card'
import Loader from '../components/common/Loader'
import AppointmentList from '../components/appointments/AppointmentList'
import ProfileManagement from '../components/profile/ProfileManagement'
import { dashboardAPI, appointmentAPI } from '../services/api'
import { formatDate, formatTime } from '../utils/helpers'
import toast from 'react-hot-toast'

const DoctorDashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="doctor" />
      <div className="flex-1">
        <Navbar />
        <div className="p-8">
          <Routes>
            <Route path="/" element={<DoctorDashboardHome />} />
            <Route path="/appointments" element={<DoctorAppointments />} />
            <Route path="/patients" element={<DoctorPatients />} />
            <Route path="/schedule" element={<DoctorSchedule />} />
            <Route path="/profile" element={<DoctorProfile />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

// Doctor Dashboard Home
const DoctorDashboardHome = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const { data } = await dashboardAPI.getDoctorStats()
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
      title: "Today's Appointments",
      value: stats?.todayAppointments || 0,
      icon: Calendar,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Patients',
      value: stats?.totalPatients || 0,
      icon: Users,
      color: 'bg-green-500',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Pending Reviews',
      value: stats?.pendingAppointments || 0,
      icon: Clock,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Rating',
      value: stats?.rating?.toFixed(1) || '0.0',
      icon: Activity,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      suffix: '/5.0'
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
        <h1 className="text-3xl font-bold mb-2">Doctor Dashboard</h1>
        <p className="text-lg opacity-90">Manage your patients and appointments efficiently</p>
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
            {stats.upcomingAppointments.map((appointment) => (
              <motion.div
                key={appointment._id}
                whileHover={{ x: 5 }}
                className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
              >
                <img
                  src={appointment.patientId?.userId?.profilePicture}
                  alt={appointment.patientId?.userId?.firstName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-primary-500"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {appointment.patientId?.userId?.firstName} {appointment.patientId?.userId?.lastName}
                  </h3>
                  <p className="text-sm text-gray-600">{appointment.type}</p>
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
    </div>
  )
}

// Doctor Appointments Component
const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    setLoading(true)
    try {
      const { data } = await appointmentAPI.getAll()
      setAppointments(data.data || [])
    } catch (error) {
      console.error('Error fetching appointments:', error)
      toast.error('Failed to load appointments')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (appointmentId, status, reason) => {
    try {
      await appointmentAPI.updateStatus(appointmentId, { status, cancellationReason: reason })
      toast.success('Appointment updated successfully')
      fetchAppointments()
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update appointment'
      toast.error(message)
    }
  }

  const handleDelete = async (appointmentId) => {
    try {
      await appointmentAPI.delete(appointmentId)
      toast.success('Appointment deleted successfully')
      fetchAppointments()
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete appointment'
      toast.error(message)
    }
  }

  const filterOptions = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled']

  const filteredAppointments = filter === 'All'
    ? appointments
    : appointments.filter(apt => apt.status === filter)

  if (loading) return <Loader />

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Appointment Management</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="input-field max-w-xs"
        >
          {filterOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <AppointmentList
        appointments={filteredAppointments}
        onStatusUpdate={handleStatusUpdate}
        onDelete={handleDelete}
        userRole="doctor"
      />
    </div>
  )
}

// Doctor Patients Component
const DoctorPatients = () => {
  return (
    <Card>
      <h2 className="text-2xl font-bold mb-6">My Patients</h2>
      <p className="text-gray-600">Patient management features coming soon...</p>
    </Card>
  )
}

// Doctor Schedule Component
const DoctorSchedule = () => {
  return (
    <Card>
      <h2 className="text-2xl font-bold mb-6">My Schedule</h2>
      <p className="text-gray-600">Schedule management features coming soon...</p>
    </Card>
  )
}

// Doctor Profile Component
const DoctorProfile = () => {
  return <ProfileManagement />
}

export default DoctorDashboard