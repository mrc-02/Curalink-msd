import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Users,
  Calendar,
  DollarSign,
  Activity,
  TrendingUp,
  Stethoscope
} from 'lucide-react'
import Sidebar from '../components/common/Sidebar'
import Navbar from '../components/common/Navbar'
import Card from '../components/common/Card'
import Loader from '../components/common/Loader'
import { dashboardAPI } from '../services/api'
import { formatDate, formatCurrency } from '../utils/helpers'
import toast from 'react-hot-toast'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const AdminDashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="admin" />
      <div className="flex-1">
        <Navbar />
        <div className="p-8">
          <Routes>
            <Route path="/" element={<AdminDashboardHome />} />
            <Route path="/doctors" element={<AdminDoctors />} />
            <Route path="/patients" element={<AdminPatients />} />
            <Route path="/appointments" element={<AdminAppointments />} />
            <Route path="/billing" element={<AdminBilling />} />
            <Route path="/settings" element={<AdminSettings />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

// Admin Dashboard Home
const AdminDashboardHome = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const { data } = await dashboardAPI.getAdminStats()
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
      title: 'Total Patients',
      value: stats?.totalPatients || 0,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      change: '+12%'
    },
    {
      title: 'Total Doctors',
      value: stats?.totalDoctors || 0,
      icon: Stethoscope,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      change: '+8%'
    },
    {
      title: 'Appointments',
      value: stats?.totalAppointments || 0,
      icon: Calendar,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      change: '+23%'
    },
    {
      title: 'Revenue',
      value: formatCurrency(stats?.totalRevenue || 0),
      icon: DollarSign,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      change: '+15%'
    }
  ]

  // Sample data for charts
  const appointmentData = [
    { name: 'Mon', appointments: 12 },
    { name: 'Tue', appointments: 19 },
    { name: 'Wed', appointments: 15 },
    { name: 'Thu', appointments: 25 },
    { name: 'Fri', appointments: 22 },
    { name: 'Sat', appointments: 18 },
    { name: 'Sun', appointments: 10 }
  ]

  const revenueData = [
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 3000 },
    { name: 'Mar', revenue: 5000 },
    { name: 'Apr', revenue: 4500 },
    { name: 'May', revenue: 6000 },
    { name: 'Jun', revenue: 5500 }
  ]

  const departmentData = [
    { name: 'Cardiology', value: 400 },
    { name: 'Pediatrics', value: 300 },
    { name: 'Orthopedics', value: 300 },
    { name: 'Neurology', value: 200 }
  ]

  const COLORS = ['#0066CC', '#10B981', '#8B5CF6', '#F59E0B']

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-medical text-white rounded-2xl p-8 shadow-lg"
      >
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-lg opacity-90">Complete overview of your healthcare system</p>
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
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold mb-2">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-4 rounded-xl`}>
                    <Icon className="text-white" size={28} />
                  </div>
                </div>
                <div className="flex items-center text-sm">
                  <TrendingUp className="text-green-500 mr-1" size={16} />
                  <span className="text-green-500 font-semibold">{stat.change}</span>
                  <span className="text-gray-500 ml-2">vs last month</span>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Appointments Chart */}
        <Card>
          <h3 className="text-xl font-bold text-gray-900 mb-6">Weekly Appointments</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={appointmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="appointments" stroke="#0066CC" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Revenue Chart */}
        <Card>
          <h3 className="text-xl font-bold text-gray-900 mb-6">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Department Distribution & Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Department Distribution */}
        <Card>
          <h3 className="text-xl font-bold text-gray-900 mb-6">Department Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={departmentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {departmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Recent Appointments */}
        <Card>
          <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Appointments</h3>
          <div className="space-y-4">
            {stats?.recentAppointments?.slice(0, 5).map((appointment, index) => (
              <motion.div
                key={appointment._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
              >
                <img
                  src={appointment.patientId?.userId?.profilePicture}
                  alt="Patient"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">
                    {appointment.patientId?.userId?.firstName} {appointment.patientId?.userId?.lastName}
                  </p>
                  <p className="text-xs text-gray-500">
                    Dr. {appointment.doctorId?.userId?.firstName} - {formatDate(appointment.appointmentDate)}
                  </p>
                </div>
                <span className={`badge text-xs ${
                  appointment.status === 'Confirmed' ? 'badge-confirmed' : 
                  appointment.status === 'Completed' ? 'badge-completed' : 'badge-pending'
                }`}>
                  {appointment.status}
                </span>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <h4 className="text-lg font-semibold text-gray-700 mb-2">Pending Appointments</h4>
          <p className="text-3xl font-bold text-blue-600">{stats?.pendingAppointments || 0}</p>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <h4 className="text-lg font-semibold text-gray-700 mb-2">Completed Today</h4>
          <p className="text-3xl font-bold text-green-600">{stats?.completedAppointments || 0}</p>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <h4 className="text-lg font-semibold text-gray-700 mb-2">Active Users</h4>
          <p className="text-3xl font-bold text-purple-600">
            {(stats?.totalPatients || 0) + (stats?.totalDoctors || 0)}
          </p>
        </Card>
      </div>
    </div>
  )
}

// Admin Doctors Component
const AdminDoctors = () => {
  return (
    <Card>
      <h2 className="text-2xl font-bold mb-6">Doctor Management</h2>
      <p className="text-gray-600">Doctor management features coming soon...</p>
    </Card>
  )
}

// Admin Patients Component
const AdminPatients = () => {
  return (
    <Card>
      <h2 className="text-2xl font-bold mb-6">Patient Management</h2>
      <p className="text-gray-600">Patient management features coming soon...</p>
    </Card>
  )
}

// Admin Appointments Component
const AdminAppointments = () => {
  return (
    <Card>
      <h2 className="text-2xl font-bold mb-6">Appointment Management</h2>
      <p className="text-gray-600">Appointment management features coming soon...</p>
    </Card>
  )
}

// Admin Billing Component
const AdminBilling = () => {
  return (
    <Card>
      <h2 className="text-2xl font-bold mb-6">Billing Management</h2>
      <p className="text-gray-600">Billing management features coming soon...</p>
    </Card>
  )
}

// Admin Settings Component
const AdminSettings = () => {
  return (
    <Card>
      <h2 className="text-2xl font-bold mb-6">System Settings</h2>
      <p className="text-gray-600">Settings management features coming soon...</p>
    </Card>
  )
}

export default AdminDashboard