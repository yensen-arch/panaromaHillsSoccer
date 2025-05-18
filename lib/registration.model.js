import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
  childFirstName: { type: String, required: true },
  childLastName: { type: String, required: true },
  parentName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  postcode: { type: String, required: true },
  uniformSize: { 
    type: String, 
    required: true,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'Don\'t need (has already)']
  },
  previousRegistration: {
    type: String,
    required: true,
    enum: [
      'registered before 2020',
      '2020 SUMMER soccer',
      '2020/2021/2023 SUMMER soccer',
      '2024 SUMMER soccer',
      'first time- never been registered before'
    ]
  },
  newsletterSubscription: { type: Boolean, default: false },
  emergencyContact: { type: String, required: true },
  emergencyPhone: { type: String, required: true },
  medicalConditions: { type: String },
  liabilityAccepted: { type: Boolean, required: true },
  agreeTerms: { type: Boolean, required: true },
  paymentStatus: { type: String, enum: ['paid', 'unpaid'], default: 'unpaid' },
  paymentMethod: { 
    type: String, 
    enum: ['online-stripe', 'in-person-cash-cheque'], 
    required: true 
  },
  seasonId: { type: mongoose.Schema.Types.ObjectId, required: true },
  seasonName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt timestamp before saving
registrationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Add a post-save hook to log the saved document
registrationSchema.post('save', function(doc) {
  console.log('Registration saved:', doc);
});

const Registration = mongoose.models.Registration || mongoose.model('Registration', registrationSchema);

export default Registration; 