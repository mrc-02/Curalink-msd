import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import { User, Mail, Lock, Phone, Eye, EyeOff, UserCircle, Stethoscope, Users } from 'lucide-react'
import Button from '../components/common/Button'
import { GENDERS, BLOOD_TYPES, SPECIALIZATIONS } from '../utils/constants'

const Register = () => {
  const [step, setStep] = useState(1)
  const [role, setRole] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    role: '',
    // Patient specific
    dateOfBirth: '',
    gender: '',
    bloodType: '',
    // Doctor specific
    specialization: '',
    experience: '',
    consultationFee: ''
  })
  const [loading, setLoading] = useState(false)

  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole)
    setFormData({ ...formData, role: selectedRole })
    setStep(2)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const user = await register(formData)
      navigate(`/${user.role}-dashboard`)
    } catch (error) {
      console.error('Registration error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1551076805-e1869033e561?w=1200"
          alt="Healthcare"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-secondary-500/90 to-primary-500/90 flex items-center justify-center p-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white text-center"
          >
            <h1 className="text-5xl font-bold mb-6">Join HealthCare Pro</h1>
            <p className="text-xl mb-8">
              Start your journey to better healthcare management
            </p>
            {/* Progress Indicator */}
            <div className="flex justify-center space-x-4 mb-8">
              <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-white' : 'bg-white/30'}`}></div>
              <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-white' : 'bg-white/30'}`}></div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center justify-center space-x-2 mb-8">
            <div className="w-12 h-12 bg-gradient-medical rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">H+</span>
            </div>
            <span className="text-2xl font-bold gradient-text">HealthCare Pro</span>
          </Link>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            {step === 1 ? (
              // Step 1: Role Selection
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
                <p className="text-gray-600 mb-8">Select your role to get started</p>

                <div className="space-y-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleRoleSelect('patient')}
                    className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all duration-300 text-left"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-primary-100 rounded-lg flex items-center justify-center">
                        <UserCircle className="text-primary-500" size={28} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">Patient</h3>
                        <p className="text-gray-600 text-sm">Book appointments and manage health records</p>
                      </div>
                    </div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleRoleSelect('doctor')}
                    className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-secondary-500 hover:bg-secondary-50 transition-all duration-300 text-left"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-secondary-100 rounded-lg flex items-center justify-center">
                        <Stethoscope className="text-secondary-500" size={28} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">Doctor</h3>
                        <p className="text-gray-600 text-sm">Manage patients and appointments</p>
                      </div>
                    </div>
                  </motion.button>
                </div>

                <p className="mt-6 text-center text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary-500 hover:text-primary-600 font-semibold">
                    Sign In
                  </Link>
                </p>
              </div>
            ) : (
                // Step 2: Registration Form
              <div>
                <button
                  onClick={() => setStep(1)}
                  className="text-primary-500 hover:text-primary-600 mb-4 flex items-center space-x-2"
                >
                  <span>←</span>
                  <span>Back</span>
                </button>

                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {role === 'patient' ? 'Patient' : 'Doctor'} Registration
                </h2>
                <p className="text-gray-600 mb-6">Fill in your details to create an account</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="John"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="Doe"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="input-field pl-12"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="input-field pl-12"
                        placeholder="+1234567890"
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="input-field pl-12 pr-12"
                        placeholder="Create a password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  {/* Patient Specific Fields */}
                  {role === 'patient' && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Date of Birth
                          </label>
                          <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            className="input-field"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Gender
                          </label>
                          <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="input-field"
                            required
                          >
                            <option value="">Select</option>
                            {GENDERS.map(gender => (
                              <option key={gender} value={gender}>{gender}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Blood Type (Optional)
                        </label>
                        <select
                          name="bloodType"
                          value={formData.bloodType}
                          onChange={handleChange}
                          className="input-field"
                        >
                          <option value="">Select</option>
                          {BLOOD_TYPES.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}

                  {/* Doctor Specific Fields */}
                  {role === 'doctor' && (
                    <>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Specialization
                        </label>
                        <select
                          name="specialization"
                          value={formData.specialization}
                          onChange={handleChange}
                          className="input-field"
                          required
                        >
                          <option value="">Select Specialization</option>
                          {SPECIALIZATIONS.map(spec => (
                            <option key={spec} value={spec}>{spec}</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Experience (Years)
                          </label>
                          <input
                            type="number"
                            name="experience"
                            value={formData.experience}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="5"
                            min="0"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Consultation Fee ($)
                          </label>
                          <input
                            type="number"
                            name="consultationFee"
                            value={formData.consultationFee}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="100"
                            min="0"
                            required
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Terms & Conditions */}
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500 mt-1"
                      required
                    />
                    <label className="ml-2 text-sm text-gray-600">
                      I agree to the{' '}
                      <Link to="/terms" className="text-primary-500 hover:text-primary-600">
                        Terms & Conditions
                      </Link>{' '}
                      and{' '}
                      <Link to="/privacy" className="text-primary-500 hover:text-primary-600">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    loading={loading}
                  >
                    Create Account
                  </Button>
                </form>

                <p className="mt-6 text-center text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary-500 hover:text-primary-600 font-semibold">
                    Sign In
                  </Link>
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Register