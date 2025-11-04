import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Phone, MapPin, Calendar, Save, Camera, Lock } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { authAPI, doctorAPI, patientAPI } from '../../services/api'
import Card from '../common/Card'
import Button from '../common/Button'
import toast from 'react-hot-toast'

const ProfileManagement = () => {
  const { user, updateUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('personal')
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        }
      })
    }
  }, [user])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data } = await authAPI.updateProfile(formData)
      updateUser(data.data)
      toast.success('Profile updated successfully!')
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordUpdate = async (e) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      await authAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })
      toast.success('Password changed successfully!')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to change password'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'personal', label: 'Personal Information', icon: User },
    { id: 'security', label: 'Security', icon: Lock }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
      </div>

      {/* Profile Header Card */}
      <Card>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <img
              src={user?.profilePicture || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400'}
              alt={user?.firstName}
              className="w-32 h-32 rounded-full object-cover border-4 border-primary-100"
            />
            <button className="absolute bottom-0 right-0 p-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition shadow-lg">
              <Camera size={20} />
            </button>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-gray-900">
              {user?.firstName} {user?.lastName}
            </h3>
            <p className="text-primary-600 font-semibold capitalize">{user?.role}</p>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Mail size={16} />
                {user?.email}
              </span>
              {user?.phone && (
                <span className="flex items-center gap-1">
                  <Phone size={16} />
                  {user?.phone}
                </span>
              )}
            </div>
            {user?.isEmailVerified ? (
              <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                ✓ Email Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                ⚠ Email Not Verified
              </span>
            )}
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-4">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 font-semibold transition ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon size={20} />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'personal' && (
        <Card>
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  className="input-field bg-gray-50"
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            {/* Address Section */}
            <div className="pt-6 border-t">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Address Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="123 Main Street"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="New York"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    State / Province
                  </label>
                  <input
                    type="text"
                    name="address.state"
                    value={formData.address.state}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="NY"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ZIP / Postal Code
                  </label>
                  <input
                    type="text"
                    name="address.zipCode"
                    value={formData.address.zipCode}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="10001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    name="address.country"
                    value={formData.address.country}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="United States"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t">
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                className="flex items-center gap-2"
              >
                <Save size={20} />
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
      )}

      {activeTab === 'security' && (
        <Card>
          <form onSubmit={handlePasswordUpdate} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Current Password *
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="input-field"
                  required
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  New Password *
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="input-field"
                  required
                  placeholder="Enter new password"
                  minLength="6"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Password must be at least 6 characters long
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="input-field"
                  required
                  placeholder="Confirm new password"
                  minLength="6"
                />
              </div>
            </div>

            {/* Password Requirements */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Password Requirements:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Minimum 6 characters long</li>
                <li>• Use a mix of letters, numbers, and symbols</li>
                <li>• Avoid common words or patterns</li>
                <li>• Don't reuse old passwords</li>
              </ul>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t">
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                className="flex items-center gap-2"
              >
                <Lock size={20} />
                Change Password
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  )
}

export default ProfileManagement
