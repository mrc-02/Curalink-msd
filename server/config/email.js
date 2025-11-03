const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send email function
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: options.email,
      subject: options.subject,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Email sending error:', error);
    throw new Error('Email could not be sent');
  }
};

// Welcome email template
const getWelcomeEmailTemplate = (user, role) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to HealthCare Pro</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #0066CC 0%, #10B981 100%);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
        }
        .content {
          background: #f9f9f9;
          padding: 30px;
          border-radius: 0 0 10px 10px;
        }
        .button {
          display: inline-block;
          padding: 12px 30px;
          background: #0066CC;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
        }
        .info-box {
          background: white;
          padding: 20px;
          border-left: 4px solid #10B981;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          color: #666;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🏥 Welcome to HealthCare Pro!</h1>
      </div>
      <div class="content">
        <h2>Hello ${user.firstName} ${user.lastName}! 👋</h2>
        <p>Thank you for registering with HealthCare Pro. We're excited to have you on board!</p>
        
        <div class="info-box">
          <h3>Your Account Details:</h3>
          <p><strong>Name:</strong> ${user.firstName} ${user.lastName}</p>
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>Role:</strong> ${role.charAt(0).toUpperCase() + role.slice(1)}</p>
          <p><strong>Registration Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>

        ${role === 'patient' ? `
          <h3>What you can do:</h3>
          <ul>
            <li>📅 Book appointments with top doctors</li>
            <li>📋 Access your medical records anytime</li>
            <li>💊 Manage your prescriptions</li>
            <li>💳 Track billing and payments</li>
            <li>📊 Monitor your health metrics</li>
          </ul>
        ` : role === 'doctor' ? `
          <h3>What you can do:</h3>
          <ul>
            <li>👥 Manage your patients</li>
            <li>📆 Set your availability schedule</li>
            <li>💼 Write prescriptions</li>
            <li>📈 View analytics dashboard</li>
            <li>💬 Communicate with patients</li>
          </ul>
        ` : ''}

        <center>
          <a href="${process.env.FRONTEND_URL}/login" class="button">
            Login to Your Dashboard
          </a>
        </center>

        <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
        
        <p>Best regards,<br><strong>The HealthCare Pro Team</strong></p>
      </div>
      <div class="footer">
        <p>This email was sent to ${user.email}</p>
        <p>&copy; ${new Date().getFullYear()} HealthCare Pro. All rights reserved.</p>
        <p>Modern Healthcare Management System</p>
      </div>
    </body>
    </html>
  `;
};

// Appointment confirmation email template
const getAppointmentEmailTemplate = (appointment, patient, doctor) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Appointment Confirmation</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #0066CC 0%, #10B981 100%);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background: #f9f9f9;
          padding: 30px;
          border-radius: 0 0 10px 10px;
        }
        .appointment-card {
          background: white;
          padding: 25px;
          border-radius: 10px;
          margin: 20px 0;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #eee;
        }
        .button {
          display: inline-block;
          padding: 12px 30px;
          background: #0066CC;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>✅ Appointment Confirmed!</h1>
      </div>
      <div class="content">
        <h2>Hello ${patient.firstName}!</h2>
        <p>Your appointment has been successfully scheduled.</p>
        
        <div class="appointment-card">
          <h3>Appointment Details:</h3>
          <div class="detail-row">
            <strong>Doctor:</strong>
            <span>Dr. ${doctor.firstName} ${doctor.lastName}</span>
          </div>
          <div class="detail-row">
            <strong>Specialization:</strong>
            <span>${appointment.specialization || 'General'}</span>
          </div>
          <div class="detail-row">
            <strong>Date:</strong>
            <span>${new Date(appointment.appointmentDate).toLocaleDateString()}</span>
          </div>
          <div class="detail-row">
            <strong>Time:</strong>
            <span>${appointment.timeSlot?.startTime || 'TBD'}</span>
          </div>
          <div class="detail-row">
            <strong>Type:</strong>
            <span>${appointment.type}</span>
          </div>
          <div class="detail-row">
            <strong>Status:</strong>
            <span style="color: #10B981; font-weight: bold;">${appointment.status}</span>
          </div>
        </div>

        <h3>Important Information:</h3>
        <ul>
          <li>Please arrive 10 minutes before your scheduled time</li>
          <li>Bring any relevant medical records or test results</li>
          <li>Bring a valid ID and insurance card (if applicable)</li>
        </ul>

        <center>
          <a href="${process.env.FRONTEND_URL}/patient-dashboard/appointments" class="button">
            View Appointment
          </a>
        </center>

        <p>If you need to reschedule or cancel, please contact us at least 24 hours in advance.</p>
        
        <p>Best regards,<br><strong>HealthCare Pro Team</strong></p>
      </div>
    </body>
    </html>
  `;
};

module.exports = {
  sendEmail,
  getWelcomeEmailTemplate,
  getAppointmentEmailTemplate
};