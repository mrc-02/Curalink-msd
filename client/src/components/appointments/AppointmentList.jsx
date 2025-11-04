import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Clock, User, MapPin, Phone, Mail, X, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { formatDate, formatTime } from '../../utils/helpers'
import Card from '../common/Card'
import Button from '../common/Button'
import Modal from '../common/Modal'

const AppointmentList = ({ appointments, onStatusUpdate, onDelete, userRole }) => {
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancellationReason, setCancellationReason] = useState('')
  const [loading, setLoading] = useState(false)

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Completed':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'No-Show':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Confirmed':
        return <CheckCircle size={16} />
      case 'Pending':
        return <Clock size={16} />
      case 'Cancelled':
      case 'No-Show':
        return <XCircle size={16} />
      default:
        return <AlertCircle size={16} />
    }
  }

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment)
    setShowDetailsModal(true)
  }

  const handleCancelClick = (appointment) => {
    setSelectedAppointment(appointment)
    setShowCancelModal(true)
  }

  const handleCancelAppointment = async () => {
    if (!cancellationReason.trim()) {
      return
    }

    setLoading(true)
    try {
      if (userRole === 'patient') {
        await onDelete(selectedAppointment._id)
      } else {
        await onStatusUpdate(selectedAppointment._id, 'Cancelled', cancellationReason)
      }
      setShowCancelModal(false)
      setCancellationReason('')
    } catch (error) {
      console.error('Error cancelling appointment:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (appointmentId, newStatus) => {
    setLoading(true)
    try {
      await onStatusUpdate(appointmentId, newStatus)
      setShowDetailsModal(false)
    } catch (error) {
      console.error('Error updating status:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!appointments || appointments.length === 0) {
    return (
      <Card>
        <div className="text-center py-12">
          <Calendar className="mx-auto mb-4 text-gray-400" size={64} />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Appointments Found</h3>
          <p className="text-gray-500">You don't have any appointments yet.</p>
        </div>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {appointments.map((appointment) => {
          const doctor = appointment.doctorId
          const patient = appointment.patientId
          const displayPerson = userRole === 'patient' ? doctor : patient

          return (
            <motion.div
              key={appointment._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <Card hover className="overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Profile Picture */}
                  <div className="flex-shrink-0">
                    <img
                      src={displayPerson?.userId?.profilePicture || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400'}
                      alt={displayPerson?.userId?.firstName}
                      className="w-20 h-20 rounded-full object-cover border-4 border-primary-100"
                    />
                  </div>

                  {/* Appointment Details */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {userRole === 'patient' ? 'Dr. ' : ''}
                          {displayPerson?.userId?.firstName} {displayPerson?.userId?.lastName}
                        </h3>
                        {userRole === 'patient' && doctor?.specialization && (
                          <p className="text-sm text-primary-600 font-semibold">
                            {doctor.specialization}
                          </p>
                        )}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${getStatusColor(appointment.status)}`}>
                        {getStatusIcon(appointment.status)}
                        {appointment.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-primary-500" />
                        <span>{formatDate(appointment.appointmentDate)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-primary-500" />
                        <span>{formatTime(appointment.timeSlot?.startTime)} - {formatTime(appointment.timeSlot?.endTime)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertCircle size={16} className="text-primary-500" />
                        <span className="font-semibold">{appointment.type}</span>
                      </div>
                    </div>

                    {appointment.symptoms && (
                      <div className="text-sm text-gray-600">
                        <span className="font-semibold">Symptoms:</span> {appointment.symptoms}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(appointment)}
                    >
                      View Details
                    </Button>
                    {(appointment.status === 'Pending' || appointment.status === 'Confirmed') && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleCancelClick(appointment)}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Appointment Details"
      >
        {selectedAppointment && (
          <div className="space-y-6">
            {/* Person Info */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <img
                src={
                  userRole === 'patient'
                    ? selectedAppointment.doctorId?.userId?.profilePicture
                    : selectedAppointment.patientId?.userId?.profilePicture
                }
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover border-2 border-primary-500"
              />
              <div>
                <h3 className="font-bold text-lg">
                  {userRole === 'patient' ? 'Dr. ' : ''}
                  {userRole === 'patient'
                    ? `${selectedAppointment.doctorId?.userId?.firstName} ${selectedAppointment.doctorId?.userId?.lastName}`
                    : `${selectedAppointment.patientId?.userId?.firstName} ${selectedAppointment.patientId?.userId?.lastName}`}
                </h3>
                {userRole === 'patient' && (
                  <p className="text-primary-600 font-semibold">
                    {selectedAppointment.doctorId?.specialization}
                  </p>
                )}
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Phone size={14} />
                    {userRole === 'patient'
                      ? selectedAppointment.doctorId?.userId?.phone
                      : selectedAppointment.patientId?.userId?.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail size={14} />
                    {userRole === 'patient'
                      ? selectedAppointment.doctorId?.userId?.email
                      : selectedAppointment.patientId?.userId?.email}
                  </span>
                </div>
              </div>
            </div>

            {/* Appointment Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-600">Date</label>
                <p className="text-gray-900">{formatDate(selectedAppointment.appointmentDate)}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Time</label>
                <p className="text-gray-900">
                  {formatTime(selectedAppointment.timeSlot?.startTime)} - {formatTime(selectedAppointment.timeSlot?.endTime)}
                </p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Type</label>
                <p className="text-gray-900">{selectedAppointment.type}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Status</label>
                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(selectedAppointment.status)}`}>
                  {selectedAppointment.status}
                </span>
              </div>
            </div>

            {selectedAppointment.symptoms && (
              <div>
                <label className="text-sm font-semibold text-gray-600">Symptoms</label>
                <p className="text-gray-900 mt-1">{selectedAppointment.symptoms}</p>
              </div>
            )}

            {selectedAppointment.notes && (
              <div>
                <label className="text-sm font-semibold text-gray-600">Notes</label>
                <p className="text-gray-900 mt-1">{selectedAppointment.notes}</p>
              </div>
            )}

            {selectedAppointment.cancellationReason && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <label className="text-sm font-semibold text-red-700">Cancellation Reason</label>
                <p className="text-red-900 mt-1">{selectedAppointment.cancellationReason}</p>
              </div>
            )}

            {/* Doctor Actions */}
            {userRole === 'doctor' && (selectedAppointment.status === 'Pending' || selectedAppointment.status === 'Confirmed') && (
              <div className="flex gap-2 pt-4 border-t">
                {selectedAppointment.status === 'Pending' && (
                  <Button
                    variant="primary"
                    onClick={() => handleStatusChange(selectedAppointment._id, 'Confirmed')}
                    loading={loading}
                    className="flex-1"
                  >
                    Confirm Appointment
                  </Button>
                )}
                {selectedAppointment.status === 'Confirmed' && (
                  <Button
                    variant="success"
                    onClick={() => handleStatusChange(selectedAppointment._id, 'Completed')}
                    loading={loading}
                    className="flex-1"
                  >
                    Mark as Completed
                  </Button>
                )}
                <Button
                  variant="danger"
                  onClick={() => {
                    setShowDetailsModal(false)
                    handleCancelClick(selectedAppointment)
                  }}
                  className="flex-1"
                >
                  Cancel Appointment
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Cancel Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => {
          setShowCancelModal(false)
          setCancellationReason('')
        }}
        title="Cancel Appointment"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to cancel this appointment? This action cannot be undone.
          </p>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Reason for Cancellation *
            </label>
            <textarea
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              className="input-field"
              rows="4"
              placeholder="Please provide a reason for cancellation..."
              required
            />
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowCancelModal(false)
                setCancellationReason('')
              }}
              className="flex-1"
            >
              Keep Appointment
            </Button>
            <Button
              variant="danger"
              onClick={handleCancelAppointment}
              loading={loading}
              disabled={!cancellationReason.trim()}
              className="flex-1"
            >
              Cancel Appointment
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default AppointmentList
