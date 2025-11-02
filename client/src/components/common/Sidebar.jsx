import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  DollarSign,
  Settings,
  Stethoscope,
  Activity,
  ClipboardList
} from 'lucide-react'

const Sidebar = ({ role }) => {
  const location = useLocation()

  const adminLinks = [
    { to: '/admin-dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin-dashboard/doctors', icon: Stethoscope, label: 'Doctors' },
    { to: '/admin-dashboard/patients', icon: Users, label: 'Patients' },
    { to: '/admin-dashboard/appointments', icon: Calendar, label: 'Appointments' },
    { to: '/admin-dashboard/billing', icon: DollarSign, label: 'Billing' },
    { to: '/admin-dashboard/settings', icon: Settings, label: 'Settings' }
  ]

  const doctorLinks = [
    { to: '/doctor-dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/doctor-dashboard/appointments', icon: Calendar, label: 'Appointments' },
    { to: '/doctor-dashboard/patients', icon: Users, label: 'My Patients' },
    { to: '/doctor-dashboard/schedule', icon: ClipboardList, label: 'Schedule' },
    { to: '/doctor-dashboard/profile', icon: Settings, label: 'Profile' }
  ]

  const patientLinks = [
    { to: '/patient-dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/patient-dashboard/appointments', icon: Calendar, label: 'Appointments' },
    { to: '/patient-dashboard/doctors', icon: Stethoscope, label: 'Find Doctors' },
    { to: '/patient-dashboard/records', icon: FileText, label: 'Medical Records' },
    { to: '/patient-dashboard/billing', icon: DollarSign, label: 'Billing' },
    { to: '/patient-dashboard/profile', icon: Settings, label: 'Profile' }
  ]

  const links = role === 'admin' ? adminLinks : role === 'doctor' ? doctorLinks : patientLinks

  return (
    <aside className="w-64 bg-white shadow-lg h-screen sticky top-0 overflow-y-auto">
      <div className="p-6">
        <h2 className="text-2xl font-bold gradient-text mb-8">
          {role === 'admin' ? 'Admin Panel' : role === 'doctor' ? 'Doctor Portal' : 'Patient Portal'}
        </h2>

        <nav className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon
            const isActive = location.pathname === link.to

            return (
              <Link
                key={link.to}
                to={link.to}
                className="relative"
              >
                <motion.div
                  whileHover={{ x: 5 }}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'bg-primary-500 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{link.label}</span>
                </motion.div>
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}

export default Sidebar