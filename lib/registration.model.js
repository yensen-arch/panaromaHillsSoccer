import mongoose from 'mongoose';

const RegistrationSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  dateOfBirth: { type: String, required: true },
  gender: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  postcode: { type: String, required: true },
  membershipType: { type: String, required: true },
  experience: { type: String },
  emergencyContact: { type: String, required: true },
  emergencyPhone: { type: String, required: true },
  medicalConditions: { type: String },
  liabilityAccepted: { type: Boolean, required: true },
  agreeTerms: { type: Boolean, required: true },
  paymentStatus: { type: String, enum: ['paid', 'unpaid'], default: 'unpaid' },
  paymentMethod: { type: String, enum: ['online', 'offline'], default: 'offline' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Registration || mongoose.model('Registration', RegistrationSchema); 