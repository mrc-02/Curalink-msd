const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');

dotenv.config();

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ MongoDB Connected');
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Doctor.deleteMany();
    await Patient.deleteMany();

    // Create Admin
    const admin = await User.create({
      email: 'admin@healthcare.com',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      phone: '+1234567890',
      profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      address: {
        street: '123 Admin St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
      }
    });

    // Create Doctors
    const doctorUsers = await User.insertMany([
      {
        email: 'dr.smith@healthcare.com',
        password: 'doctor123',
        firstName: 'John',
        lastName: 'Smith',
        role: 'doctor',
        phone: '+1234567891',
        profilePicture: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
        address: {
          street: '456 Medical Ave',
          city: 'Boston',
          state: 'MA',
          zipCode: '02101',
          country: 'USA'
        }
      },
      {
        email: 'dr.johnson@healthcare.com',
        password: 'doctor123',
        firstName: 'Sarah',
        lastName: 'Johnson',
        role: 'doctor',
        phone: '+1234567892',
        profilePicture: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
        address: {
          street: '789 Health Blvd',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90001',
          country: 'USA'
        }
      },
      {
        email: 'dr.williams@healthcare.com',
        password: 'doctor123',
        firstName: 'Michael',
        lastName: 'Williams',
        role: 'doctor',
        phone: '+1234567893',
        profilePicture: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400',
        address: {
          street: '321 Care Lane',
          city: 'Chicago',
          state: 'IL',
          zipCode: '60601',
          country: 'USA'
        }
      }
    ]);

    // Create Doctor profiles
    await Doctor.insertMany([
      {
        userId: doctorUsers[0]._id,
        specialization: 'Cardiology',
        qualifications: [
          { degree: 'MBBS', institution: 'Harvard Medical School', year: 2010 },
          { degree: 'MD Cardiology', institution: 'Johns Hopkins', year: 2015 }
        ],
        experience: 9,
        bio: 'Experienced cardiologist specializing in heart disease prevention and treatment.',
        consultationFee: 150,
        availability: [
          {
            day: 'Monday',
            slots: [
              { startTime: '09:00', endTime: '10:00' },
              { startTime: '10:00', endTime: '11:00' },
              { startTime: '11:00', endTime: '12:00' }
            ]
          },
          {
            day: 'Wednesday',
            slots: [
              { startTime: '14:00', endTime: '15:00' },
              { startTime: '15:00', endTime: '16:00' }
            ]
          }
        ],
        rating: 4.8,
        totalReviews: 127,
        languages: ['English', 'Spanish'],
        registrationNumber: 'DOC-2015-001',
        department: 'Cardiology',
        totalPatients: 350,
        totalAppointments: 890
      },
      {
        userId: doctorUsers[1]._id,
        specialization: 'Pediatrics',
        qualifications: [
          { degree: 'MBBS', institution: 'Stanford University', year: 2012 },
          { degree: 'MD Pediatrics', institution: 'Yale University', year: 2017 }
        ],
        experience: 7,
        bio: 'Dedicated pediatrician committed to children\'s health and wellbeing.',
        consultationFee: 120,
        availability: [
          {
            day: 'Tuesday',
            slots: [
              { startTime: '09:00', endTime: '10:00' },
              { startTime: '10:00', endTime: '11:00' }
            ]
          },
          {
            day: 'Thursday',
            slots: [
              { startTime: '13:00', endTime: '14:00' },
              { startTime: '14:00', endTime: '15:00' }
            ]
          }
        ],
        rating: 4.9,
        totalReviews: 203,
        languages: ['English', 'French'],
        registrationNumber: 'DOC-2017-002',
        department: 'Pediatrics',
        totalPatients: 420,
        totalAppointments: 1050
      },
      {
        userId: doctorUsers[2]._id,
        specialization: 'Orthopedics',
        qualifications: [
          { degree: 'MBBS', institution: 'Columbia University', year: 2011 },
          { degree: 'MS Orthopedics', institution: 'UCLA', year: 2016 }
        ],
        experience: 8,
        bio: 'Orthopedic surgeon specializing in sports injuries and joint replacements.',
        consultationFee: 180,
        availability: [
          {
            day: 'Monday',
            slots: [
              { startTime: '14:00', endTime: '15:00' },
              { startTime: '15:00', endTime: '16:00' }
            ]
          },
          {
            day: 'Friday',
            slots: [
              { startTime: '09:00', endTime: '10:00' },
              { startTime: '10:00', endTime: '11:00' }
            ]
          }
        ],
        rating: 4.7,
        totalReviews: 156,
        languages: ['English'],
        registrationNumber: 'DOC-2016-003',
        department: 'Orthopedics',
        totalPatients: 280,
        totalAppointments: 670
      }
    ]);

    // Create Patients
    const patientUsers = await User.insertMany([
      {
        email: 'patient1@email.com',
        password: 'patient123',
        firstName: 'Emma',
        lastName: 'Davis',
        role: 'patient',
        phone: '+1234567894',
        profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
        address: {
          street: '111 Patient Rd',
          city: 'Seattle',
          state: 'WA',
          zipCode: '98101',
          country: 'USA'
        }
      },
      {
        email: 'patient2@email.com',
        password: 'patient123',
        firstName: 'James',
        lastName: 'Wilson',
        role: 'patient',
        phone: '+1234567895',
        profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
        address: {
          street: '222 Health St',
          city: 'Miami',
          state: 'FL',
          zipCode: '33101',
          country: 'USA'
        }
      }
    ]);

    // Create Patient profiles
    await Patient.insertMany([
      {
        userId: patientUsers[0]._id,
        dateOfBirth: new Date('1990-05-15'),
        gender: 'Female',
        bloodType: 'A+',
        height: { value: 165, unit: 'cm' },
        weight: { value: 58, unit: 'kg' },
        allergies: [
          { name: 'Penicillin', severity: 'Severe', reaction: 'Rash and difficulty breathing' }
        ],
        chronicConditions: [],
        emergencyContact: {
          name: 'Robert Davis',
          relationship: 'Spouse',
          phone: '+1234567896',
          email: 'robert.davis@email.com'
        },
        insuranceInfo: {
          provider: 'HealthCare Plus',
          policyNumber: 'HCP123456',
          groupNumber: 'GRP001',
          validUntil: new Date('2025-12-31')
        }
      },
      {
        userId: patientUsers[1]._id,
        dateOfBirth: new Date('1985-08-22'),
        gender: 'Male',
        bloodType: 'O+',
        height: { value: 178, unit: 'cm' },
        weight: { value: 82, unit: 'kg' },
        allergies: [],
        chronicConditions: [
          {
            condition: 'Hypertension',
            diagnosedDate: new Date('2020-03-10'),
            status: 'Controlled'
          }
        ],
        emergencyContact: {
          name: 'Lisa Wilson',
          relationship: 'Spouse',
          phone: '+1234567897',
          email: 'lisa.wilson@email.com'
        },
        insuranceInfo: {
          provider: 'MediCare Insurance',
          policyNumber: 'MCI789012',
          groupNumber: 'GRP002',
          validUntil: new Date('2025-11-30')
        }
      }
    ]);

    console.log('✅ Data seeded successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('Admin: admin@healthcare.com / admin123');
    console.log('Doctor: dr.smith@healthcare.com / doctor123');
    console.log('Patient: patient1@email.com / patient123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
};

seedData();