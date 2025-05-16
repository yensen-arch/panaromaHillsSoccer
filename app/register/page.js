'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import Link from 'next/link';
import { 
  CheckCircle, 
  AlertCircle, 
  ArrowRight,
  Check
} from 'lucide-react';
import Image  from 'next/image';


// Replace with your own Stripe publishable key when actually implementing
const stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY);

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    postcode: '',
    membershipType: 'standard',
    experience: '',
    emergencyContact: '',
    emergencyPhone: '',
    medicalConditions: '',
    agreeTerms: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);

  const membershipOptions = [
    {
      id: 'standard',
      name: 'Standard Membership',
      price: '£120/year',
      features: [
        'Access to club facilities',
        'Weekly training sessions',
        'Club kit (jersey, shorts, socks)',
        'Insurance coverage',
        'Participation in club tournaments'
      ]
    },
    {
      id: 'premium',
      name: 'Premium Membership',
      price: '£200/year',
      features: [
        'All Standard benefits',
        'Personal training session (monthly)',
        'Premium club kit (home and away)',
        'Free entry to social events',
        'Priority registration for special events',
        'Fitness assessment twice yearly'
      ]
    },
    {
      id: 'youth',
      name: 'Youth Membership',
      price: '£80/year',
      features: [
        'Age-appropriate training',
        'Club kit (jersey, shorts, socks)',
        'Insurance coverage',
        'Skill development focus',
        'Participation in youth tournaments',
        'End of season certificate'
      ]
    }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Please select a gender';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.postcode.trim()) newErrors.postcode = 'Postcode is required';
    if (!formData.membershipType) newErrors.membershipType = 'Please select a membership type';
    if (!formData.emergencyContact.trim()) newErrors.emergencyContact = 'Emergency contact is required';
    if (!formData.emergencyPhone.trim()) newErrors.emergencyPhone = 'Emergency contact phone is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};
    
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
      window.scrollTo(0, 0);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep3()) return;
    
    setIsLoading(true);
    
    try {
      // In a real app, you would submit to your API to create a Stripe Checkout session
      // const response = await fetch('/api/create-checkout-session', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      
      // const { sessionId } = await response.json();
      // const stripe = await stripePromise;
      // const { error } = await stripe.redirectToCheckout({ sessionId });
      
      // For demo purposes, simulate payment success
      await new Promise(resolve => setTimeout(resolve, 2000));
      setPaymentStatus('success');
      
    } catch (error) {
      console.error('Error:', error);
      setPaymentStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            First Name *
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
              errors.firstName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your first name"
          />
          {errors.firstName && <p className="text-sm text-red-600">{errors.firstName}</p>}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            Last Name *
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
              errors.lastName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your last name"
          />
          {errors.lastName && <p className="text-sm text-red-600">{errors.lastName}</p>}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your email"
          />
          {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your phone number"
          />
          {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
            Date of Birth *
          </label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
              errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.dateOfBirth && <p className="text-sm text-red-600">{errors.dateOfBirth}</p>}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
            Gender *
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
              errors.gender ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {errors.gender && <p className="text-sm text-red-600">{errors.gender}</p>}
        </div>
      </div>
      
      <div className="flex justify-end mt-8">
        <button
          type="button"
          onClick={nextStep}
          className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-300 flex items-center transform hover:scale-105"
        >
          Next Step <ArrowRight className="ml-2 h-5 w-5" />
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Additional Information</h2>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Address *
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
              errors.address ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your address"
          />
          {errors.address && <p className="text-sm text-red-600">{errors.address}</p>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
              City *
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                errors.city ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your city"
            />
            {errors.city && <p className="text-sm text-red-600">{errors.city}</p>}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="postcode" className="block text-sm font-medium text-gray-700">
              Postcode *
            </label>
            <input
              type="text"
              id="postcode"
              name="postcode"
              value={formData.postcode}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                errors.postcode ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your postcode"
            />
            {errors.postcode && <p className="text-sm text-red-600">{errors.postcode}</p>}
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
          Football Experience
        </label>
        <textarea
          id="experience"
          name="experience"
          rows="3"
          value={formData.experience}
          onChange={handleChange}
          placeholder="Tell us about your football experience (level played, positions, etc.)"
          className="w-full p-3 border border-gray-300 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        ></textarea>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700">
            Emergency Contact Name *
          </label>
          <input
            type="text"
            id="emergencyContact"
            name="emergencyContact"
            value={formData.emergencyContact}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
              errors.emergencyContact ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter emergency contact name"
          />
          {errors.emergencyContact && <p className="text-sm text-red-600">{errors.emergencyContact}</p>}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="emergencyPhone" className="block text-sm font-medium text-gray-700">
            Emergency Contact Phone *
          </label>
          <input
            type="tel"
            id="emergencyPhone"
            name="emergencyPhone"
            value={formData.emergencyPhone}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
              errors.emergencyPhone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter emergency contact phone"
          />
          {errors.emergencyPhone && <p className="text-sm text-red-600">{errors.emergencyPhone}</p>}
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="medicalConditions" className="block text-sm font-medium text-gray-700">
          Medical Conditions or Allergies
        </label>
        <textarea
          id="medicalConditions"
          name="medicalConditions"
          rows="3"
          value={formData.medicalConditions}
          onChange={handleChange}
          placeholder="Please list any medical conditions or allergies we should be aware of"
          className="w-full p-3 border border-gray-300 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        ></textarea>
      </div>
      
      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={prevStep}
          className="px-6 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-300"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={nextStep}
          className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-300 flex items-center transform hover:scale-105"
        >
          Next Step <ArrowRight className="ml-2 h-5 w-5" />
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Membership & Payment</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {membershipOptions.map((option) => (
          <div 
            key={option.id}
            className={`border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg ${
              formData.membershipType === option.id
                ? 'border-primary-500 shadow-lg transform -translate-y-1'
                : 'border-gray-200 hover:border-primary-300'
            }`}
          >
            <div className={`p-6 ${formData.membershipType === option.id ? 'bg-primary-50' : 'bg-white'}`}>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900">{option.name}</h3>
                {formData.membershipType === option.id && (
                  <Check className="h-6 w-6 text-primary-600" />
                )}
              </div>
              <p className="text-2xl font-bold text-primary-600 mb-4">{option.price}</p>
              <ul className="space-y-3">
                {option.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      membershipType: option.id
                    });
                  }}
                  className={`w-full py-3 rounded-lg transition-all duration-300 ${
                    formData.membershipType === option.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-primary-600 border border-primary-600 hover:bg-primary-50'
                  }`}
                >
                  {formData.membershipType === option.id ? 'Selected' : 'Select'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Terms and Conditions</h3>
        <div className="h-40 overflow-y-auto p-4 bg-white border border-gray-200 rounded-lg mb-4 text-sm text-gray-700">
          <p className="mb-2">By registering with Panaroma Hills Soccer Club, you agree to the following terms and conditions:</p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Membership is valid for one year from the date of registration.</li>
            <li>Members must adhere to the club's code of conduct at all times.</li>
            <li>Membership fees are non-refundable except in exceptional circumstances.</li>
            <li>The club reserves the right to refuse or revoke membership.</li>
            <li>Members are expected to attend training sessions regularly.</li>
            <li>The club is not responsible for personal belongings left at the facilities.</li>
            <li>Members must inform the club of any changes to their personal information.</li>
            <li>Photos and videos may be taken during club activities for promotional purposes.</li>
            <li>Members must have appropriate insurance coverage.</li>
            <li>All members must follow the directions of coaches and club officials.</li>
          </ol>
        </div>
        <div className="flex items-start mb-4">
          <input
            type="checkbox"
            id="agreeTerms"
            name="agreeTerms"
            checked={formData.agreeTerms}
            onChange={handleChange}
            className="mt-1 mr-2 h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <label htmlFor="agreeTerms" className="text-gray-700">
            I have read and agree to the terms and conditions *
          </label>
        </div>
        {errors.agreeTerms && <p className="mt-1 text-sm text-red-600">{errors.agreeTerms}</p>}
      </div>
      
      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={prevStep}
          className="px-6 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-300"
        >
          Previous
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-300 flex items-center transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            'Complete Registration'
          )}
        </button>
      </div>
    </div>
  );

  const renderPaymentStatus = () => (
    <div className="text-center max-w-2xl mx-auto">
      {paymentStatus === 'success' ? (
        <div className="p-8 bg-white rounded-2xl shadow-xl border border-green-200">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-green-100 p-4">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Registration Successful!</h2>
          <p className="text-xl text-gray-700 mb-6">
            Thank you for registering with Panaroma Hills Soccer Club. We're excited to welcome you to our club!
          </p>
          <p className="text-gray-700 mb-8">
            You will receive a confirmation email shortly with your membership details and next steps.
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105"
          >
            Return to Homepage
          </Link>
        </div>
      ) : (
        <div className="p-8 bg-white rounded-2xl shadow-xl border border-red-200">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-red-100 p-4">
              <AlertCircle className="h-16 w-16 text-red-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Payment Failed</h2>
          <p className="text-xl text-gray-700 mb-6">
            There was an issue processing your payment. Please try again or contact support.
          </p>
          <button
            onClick={() => setPaymentStatus(null)}
            className="inline-block px-8 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-50">
      <div className="relative bg-primary-800 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://res.cloudinary.com/dqh2tacov/image/upload/v1746527286/texture-grass-field_1232-251_vbf97q.webp"
            alt="Grass Background"
            fill
            className="object-cover opacity-20"
            priority
          />
        </div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Join Panaroma Hills Soccer Club</h1>
          <p className="text-xl max-w-2xl mx-auto text-primary-100">
            Become a member of our football community today
          </p>
        </div>
      </div>

      <section className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {!paymentStatus ? (
          <>
            <div className="mb-12">
              <div className="flex items-center justify-center">
                <div className="relative flex w-full max-w-3xl justify-between">
                  {[1, 2, 3].map((stepNumber) => (
                    <div key={stepNumber} className="relative flex flex-col items-center w-1/3">
                      <div 
                        className={`flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300 z-10 ${
                          stepNumber < step ? 'bg-primary-600 scale-110' : 
                          stepNumber === step ? 'bg-primary-600 ring-4 ring-primary-200' : 'bg-gray-200'
                        } text-white font-bold`}
                      >
                        {stepNumber < step ? (
                          <Check className="h-6 w-6" />
                        ) : (
                          stepNumber
                        )}
                      </div>
                      <div className="mt-3 text-sm font-medium text-gray-600 text-center">
                        {stepNumber === 1 && 'Personal Info'}
                        {stepNumber === 2 && 'Additional Info'}
                        {stepNumber === 3 && 'Membership & Payment'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
              </form>
            </div>
          </>
        ) : (
          renderPaymentStatus()
        )}
      </section>
    </div>
  );
}