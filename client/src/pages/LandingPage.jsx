import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Calendar,
  Users,
  FileText,
  Shield,
  Clock,
  Heart,
  Activity,
  Stethoscope,
  Award,
  CheckCircle
} from 'lucide-react'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'

const LandingPage = () => {
  const features = [
    {
      icon: Calendar,
      title: 'Easy Appointments',
      description: 'Book appointments with top doctors in just a few clicks'
    },
    {
      icon: FileText,
      title: 'Digital Records',
      description: 'Access your medical records anytime, anywhere'
    },
    {
      icon: Users,
      title: 'Expert Doctors',
      description: 'Connect with certified healthcare professionals'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your health data is encrypted and protected'
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Round-the-clock customer support for your needs'
    },
    {
      icon: Heart,
      title: 'Quality Care',
      description: 'Comprehensive healthcare management system'
    }
  ]

  const doctors = [
    {
      name: 'Dr. John Smith',
      specialty: 'Cardiologist',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
      rating: 4.8,
      patients: 350
    },
    {
      name: 'Dr. Sarah Johnson',
      specialty: 'Pediatrician',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
      rating: 4.9,
      patients: 420
    },
    {
      name: 'Dr. Michael Williams',
      specialty: 'Orthopedic',
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400',
      rating: 4.7,
      patients: 280
    }
  ]

  const testimonials = [
    {
      name: 'Emma Davis',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      text: 'HealthCare Pro made it so easy to manage my appointments and medical records. Highly recommended!',
      rating: 5
    },
    {
      name: 'James Wilson',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      text: 'The platform is intuitive and the doctors are top-notch. Best healthcare experience ever!',
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 pt-20 pb-32">
        <div className="absolute inset-0 medical-pattern opacity-30"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Your Health, Our{' '}
                <span className="gradient-text">Priority</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Modern healthcare management system connecting patients with expert doctors. 
                Book appointments, manage records, and take control of your health journey.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary text-lg"
                  >
                    Get Started Free
                  </motion.button>
                </Link>
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-outline text-lg"
                  >
                    Sign In
                  </motion.button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12">
                <div>
                  <h3 className="text-3xl font-bold text-primary-500">500+</h3>
                  <p className="text-gray-600">Expert Doctors</p>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-primary-500">10K+</h3>
                  <p className="text-gray-600">Happy Patients</p>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-primary-500">50K+</h3>
                  <p className="text-gray-600">Appointments</p>
                </div>
              </div>
            </motion.div>

            {/* Right Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800"
                alt="Healthcare"
                className="rounded-2xl shadow-2xl"
              />
              {/* Floating Card */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-6 max-w-xs"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="text-green-500" size={24} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Appointment Confirmed</p>
                    <p className="text-sm text-gray-500">Dr. Smith - Today 3:00 PM</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-bold text-gray-900 mb-4"
            >
              Why Choose HealthCare Pro?
            </motion.h2>
            <p className="text-xl text-gray-600">
              Comprehensive healthcare solutions at your fingertips
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-gradient-to-br from-white to-primary-50 rounded-xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 border border-primary-100"
                >
                  <div className="w-14 h-14 bg-gradient-medical rounded-lg flex items-center justify-center mb-6">
                    <Icon className="text-white" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-bold text-gray-900 mb-4"
            >
              Meet Our Expert Doctors
            </motion.h2>
            <p className="text-xl text-gray-600">
              Certified healthcare professionals ready to serve you
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {doctors.map((doctor, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300"
              >
                <div className="relative">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 flex items-center space-x-1">
                    <Activity className="text-yellow-500" size={16} />
                    <span className="font-semibold text-gray-800">{doctor.rating}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {doctor.name}
                  </h3>
                  <p className="text-primary-500 font-semibold mb-4">
                    {doctor.specialty}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Users size={16} />
                      <span>{doctor.patients}+ Patients</span>
                    </div>
                  </div>
                  <Link to="/register">
                    <button className="w-full mt-6 btn-primary">
                      Book Appointment
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-bold text-gray-900 mb-4"
            >
              What Our Patients Say
            </motion.h2>
            <p className="text-xl text-gray-600">
              Real experiences from real people
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-primary-50 to-white rounded-2xl p-8 shadow-card"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <div className="flex text-yellow-500">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i}>⭐</span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.text}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-medical text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">
              Ready to Take Control of Your Health?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of satisfied patients and experience modern healthcare
            </p>
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-primary-500 px-10 py-4 rounded-lg font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                Get Started Today
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default LandingPage