import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, Search, Star, DollarSign, Award } from 'lucide-react'
import { doctorAPI, appointmentAPI } from '../../services/api'
import Card from '../common/Card'
import Button from '../common/Button'
import Modal from '../common/Modal'
import toast from 'react-hot-toast'

const BookAppointment = ({ onSuccess }) => {
  const [step, setStep] = useState(1)
  const [doctors, setDoctors] = useState([])
  const [filteredDoctors, setFilteredDoctors] = useState([])
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSpecialization, setSelectedSpecialization] = useState('All')
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const [appointmentData, setAppointmentData] = useState({
    appointmentDate: '',
    timeSlot: { startTime: '', endTime: '' },
    type: 'Consultation',
    symptoms: ''
  })

  const specializations = [
    'All',
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

  const appointmentTypes = [
    'Consultation',
    'Follow-up',
    'Emergency',
    'Routine Check-up'
  ]

  const timeSlots = [
    { startTime: '09:00', endTime: '09:30' },
    { startTime: '09:30', endTime: '10:00' },
    { startTime: '10:00', endTime: '10:30' },
    { startTime: '10:30', endTime: '11:00' },
    { startTime: '11:00', endTime: '11:30' },
    { startTime: '11:30', endTime: '12:00' },
    { startTime: '14:00', endTime: '14:30' },
    { startTime: '14:30', endTime: '15:00' },
    { startTime: '15:00', endTime: '15:30' },
    { startTime: '15:30', endTime: '16:00' },
    { startTime: '16:00', endTime: '16:30' },
    { startTime: '16:30', endTime: '17:00' }
  ]

  useEffect(() => {
    fetchDoctors()
  }, [])

  useEffect(() => {
    filterDoctors()
  }, [searchTerm, selectedSpecialization, doctors])

  const fetchDoctors = async () => {
    setLoading(true)
    try {
      const { data } = await doctorAPI.getAll()
      setDoctors(data.data || [])
      setFilteredDoctors(data.data || [])
    } catch (error) {
      console.error('Error fetching doctors:', error)
      toast.error('Failed to load doctors')
    } finally {
      setLoading(false)
    }
  }

  const filterDoctors = () => {
    let filtered = doctors

    if (selectedSpecialization !== 'All') {
      filtered = filtered.filter(doc => doc.specialization === selectedSpecialization)
    }

    if (searchTerm) {
      filtered = filtered.filter(doc =>
        `${doc.userId?.firstName} ${doc.userId?.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        doc.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredDoctors(filtered)
  }

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor)
    setStep(2)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setAppointmentData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleTimeSlotSelect = (slot) => {
    setAppointmentData(prev => ({
      ...prev,
      timeSlot: slot
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!appointmentData.appointmentDate || !appointmentData.timeSlot.startTime) {
      toast.error('Please select date and time slot')
      return
    }

    setLoading(true)
    try {
      const payload = {
        doctorId: selectedDoctor._id,
        appointmentDate: appointmentData.appointmentDate,
        timeSlot: appointmentData.timeSlot,
        type: appointmentData.type,
        symptoms: appointmentData.symptoms
      }

      const { data } = await appointmentAPI.create(payload)
      toast.success(data.message || 'Appointment booked successfully!')
      setShowModal(false)
      setStep(1)
      setSelectedDoctor(null)
      setAppointmentData({
        appointmentDate: '',
        timeSlot: { startTime: '', endTime: '' },
        type: 'Consultation',
        symptoms: ''
      })
      if (onSuccess) onSuccess()
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to book appointment'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const getTomorrowDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  return (
    <>
      <Button
        variant="primary"
        onClick={() => setShowModal(true)}
        className="mb-6"
      >
        Book New Appointment
      </Button>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setStep(1)
          setSelectedDoctor(null)
        }}
        title={step === 1 ? 'Select Doctor' : 'Schedule Appointment'}
        size="large"
      >
        {step === 1 ? (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search doctors by name or specialization..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>

              <div className="flex gap-2 flex-wrap">
                {specializations.map((spec) => (
                  <button
                    key={spec}
                    onClick={() => setSelectedSpecialization(spec)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                      selectedSpecialization === spec
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {spec}
                  </button>
                ))}
              </div>
            </div>

            {/* Doctors List */}
            <div className="grid md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {filteredDoctors.map((doctor) => (
                <motion.div
                  key={doctor._id}
                  whileHover={{ scale: 1.02 }}
                  className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-primary-500 hover:shadow-md transition"
                  onClick={() => handleDoctorSelect(doctor)}
                >
                  <div className="flex gap-4">
                    <img
                      src={doctor.userId?.profilePicture || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400'}
                      alt={doctor.userId?.firstName}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">
                        Dr. {doctor.userId?.firstName} {doctor.userId?.lastName}
                      </h3>
                      <p className="text-sm text-primary-600 font-semibold">
                        {doctor.specialization}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <Star size={12} className="text-yellow-500" />
                          {doctor.rating?.toFixed(1) || '0.0'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Award size={12} />
                          {doctor.experience}+ yrs
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign size={12} />
                          ${doctor.consultationFee}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredDoctors.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No doctors found matching your criteria</p>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Selected Doctor Info */}
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <div className="flex items-center gap-4">
                <img
                  src={selectedDoctor?.userId?.profilePicture}
                  alt={selectedDoctor?.userId?.firstName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-primary-500"
                />
                <div>
                  <h3 className="font-bold text-lg">
                    Dr. {selectedDoctor?.userId?.firstName} {selectedDoctor?.userId?.lastName}
                  </h3>
                  <p className="text-primary-600 font-semibold">
                    {selectedDoctor?.specialization}
                  </p>
                  <p className="text-sm text-gray-600">
                    Consultation Fee: ${selectedDoctor?.consultationFee}
                  </p>
                </div>
              </div>
            </div>

            {/* Appointment Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Appointment Type *
              </label>
              <select
                name="type"
                value={appointmentData.type}
                onChange={handleInputChange}
                className="input-field"
                required
              >
                {appointmentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Appointment Date *
              </label>
              <input
                type="date"
                name="appointmentDate"
                value={appointmentData.appointmentDate}
                onChange={handleInputChange}
                min={getTomorrowDate()}
                className="input-field"
                required
              />
            </div>

            {/* Time Slot Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Time Slot *
              </label>
              <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.startTime}
                    type="button"
                    onClick={() => handleTimeSlotSelect(slot)}
                    className={`p-3 rounded-lg border-2 text-sm font-semibold transition ${
                      appointmentData.timeSlot.startTime === slot.startTime
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    <Clock size={16} className="mx-auto mb-1" />
                    {slot.startTime}
                  </button>
                ))}
              </div>
            </div>

            {/* Symptoms */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Symptoms / Reason for Visit
              </label>
              <textarea
                name="symptoms"
                value={appointmentData.symptoms}
                onChange={handleInputChange}
                className="input-field"
                rows="4"
                placeholder="Describe your symptoms or reason for consultation..."
                maxLength="500"
              />
              <p className="text-xs text-gray-500 mt-1">
                {appointmentData.symptoms.length}/500 characters
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1"
              >
                Back to Doctors
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                className="flex-1"
              >
                Book Appointment
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </>
  )
}

export default BookAppointment
