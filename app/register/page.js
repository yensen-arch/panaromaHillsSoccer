'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import Link from 'next/link';
import { 
  CheckCircle, 
  AlertCircle, 
  ArrowRight,
  Check
} from 'lucide-react';
import Image  from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';



// Replace with your own Stripe publishable key when actually implementing
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

console.log("stripePublishableKey",process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function RegisterPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showIntroModal, setShowIntroModal] = useState(false);
  const [formData, setFormData] = useState({
    childFirstName: '',
    childLastName: '',
    parentName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    postcode: '',
    uniformSize: '',
    previousRegistration: '',
    newsletterSubscription: false,
    emergencyContact: '',
    emergencyPhone: '',
    medicalConditions: '',
    liabilityAccepted: false,
    agreeTerms: false,
    paymentMethod: '',
    seasonId: '',
    seasonName: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);

  // Add useEffect to check for Stripe success and handle intro modal
  useEffect(() => {
    // Check if we're returning from Stripe
    const query = new URLSearchParams(window.location.search);
    const sessionId = query.get('session_id');
    
    if (sessionId) {
      // Verify the payment status
      const verifyPayment = async () => {
        try {
          const response = await fetch(`/api/verify-payment?session_id=${sessionId}`);
          if (response.ok) {
            setPaymentStatus('success');
            toast({
              title: "Registration Successful",
              description: "Thank you for registering with Panorama Hills Soccer Club!",
            });
            // Redirect to home after 2 seconds
            setTimeout(() => {
              router.push('/');
            }, 2000);
          } else {
            setPaymentStatus('error');
            toast({
              title: "Payment Error",
              description: "There was an error verifying your payment. Please contact support.",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error('Error verifying payment:', error);
          setPaymentStatus('error');
          toast({
            title: "Payment Error",
            description: "There was an error verifying your payment. Please contact support.",
            variant: "destructive",
          });
        }
      };

      verifyPayment();
    } else {
      // Only show intro modal if we're not returning from Stripe
      setShowIntroModal(true);
    }
  }, [router, toast]);

  // Add useEffect to fetch active season
  useEffect(() => {
    const fetchActiveSeason = async () => {
      try {
        const response = await fetch('/api/seasons/active');
        const data = await response.json();
        
        if (data.success && data.season) {
          setFormData(prev => ({
            ...prev,
            seasonId: data.season._id,
            seasonName: data.season.heading
          }));
        }
      } catch (error) {
        console.error('Error fetching active season:', error);
      }
    };

    fetchActiveSeason();
  }, []);

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
    
    if (!formData.childFirstName.trim()) newErrors.childFirstName = 'Child\'s first name is required';
    if (!formData.childLastName.trim()) newErrors.childLastName = 'Child\'s last name is required';
    if (!formData.parentName.trim()) newErrors.parentName = 'Parent\'s name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Please select a gender';
    if (!formData.uniformSize) newErrors.uniformSize = 'Please select a uniform size';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.postcode.trim()) newErrors.postcode = 'Postcode is required';
    if (!formData.previousRegistration) newErrors.previousRegistration = 'Please select previous registration status';
    if (!formData.emergencyContact.trim()) newErrors.emergencyContact = 'Emergency contact is required';
    if (!formData.emergencyPhone.trim()) newErrors.emergencyPhone = 'Emergency contact phone is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};
    
    if (!formData.liabilityAccepted) {
      newErrors.liabilityAccepted = 'You must accept the liability waiver';
    }
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and conditions';
    }
    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Please select a payment method';
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
      // Calculate total amount based on uniform selection
      const baseAmount = 100;
      const serviceFee = 0.03; // 3% service fee
      const uniformDiscount = formData.uniformSize === "Don't need (has already)" ? 25 : 0;
      const totalAmount = Math.round((baseAmount - uniformDiscount) * (1 + serviceFee));

      if (formData.paymentMethod === 'online-stripe') {
        // For online payment, create an unpaid registration first
        const registrationResponse = await fetch('/api/registration', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            paymentStatus: 'unpaid',
            paymentMethod: 'online-stripe',
            totalAmount
          })
        });

        if (!registrationResponse.ok) {
          throw new Error('Failed to create registration');
        }

        const registrationData = await registrationResponse.json();

        // Create Stripe checkout session
        const response = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            registrationId: registrationData._id,
            amount: totalAmount,
            email: formData.email,
            name: `${formData.childFirstName} ${formData.childLastName}`
          })
        });
        
        if (!response.ok) {
          throw new Error('Failed to create checkout session');
        }

        const { sessionId } = await response.json();
        const stripe = await stripePromise;
        const { error } = await stripe.redirectToCheckout({ sessionId });
        
        if (error) {
          console.error('Error:', error);
          setPaymentStatus('error');
          toast({
            title: "Payment Error",
            description: "There was an error processing your payment. Please try again.",
            variant: "destructive",
          });
        }
      } else {
        // For offline payment, create the registration directly
        const registrationResponse = await fetch('/api/registration', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            paymentStatus: 'unpaid',
            paymentMethod: 'in-person-cash-cheque',
            totalAmount
          })
        });

        if (!registrationResponse.ok) {
          throw new Error('Failed to register user');
        }

        // Send confirmation email
        const emailResponse = await fetch('/api/send-registration-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            childName: `${formData.childFirstName} ${formData.childLastName}`,
            parentName: formData.parentName
          })
        });

        if (!emailResponse.ok) {
          console.error('Failed to send confirmation email');
        }

        setPaymentStatus('success');
        toast({
          title: "Registration Successful",
          description: "Thank you for registering with Panorama Hills Soccer Club!",
        });
        
        // Redirect to home after 2 seconds
        setTimeout(() => {
          router.push('/');
        }, 2000);
      }
    } catch (error) {
      console.error('Error:', error);
      setPaymentStatus('error');
      toast({
        title: "Registration Error",
        description: "There was an error processing your registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Child's Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="childFirstName" className="block text-sm font-medium text-gray-700">
            Child's First Name *
          </label>
          <input
            type="text"
            id="childFirstName"
            name="childFirstName"
            value={formData.childFirstName}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
              errors.childFirstName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter child's first name"
          />
          {errors.childFirstName && <p className="text-sm text-red-600">{errors.childFirstName}</p>}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="childLastName" className="block text-sm font-medium text-gray-700">
            Child's Last Name *
          </label>
          <input
            type="text"
            id="childLastName"
            name="childLastName"
            value={formData.childLastName}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
              errors.childLastName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter child's last name"
          />
          {errors.childLastName && <p className="text-sm text-red-600">{errors.childLastName}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="parentName" className="block text-sm font-medium text-gray-700">
          Parent's Name *
        </label>
        <input
          type="text"
          id="parentName"
          name="parentName"
          value={formData.parentName}
          onChange={handleChange}
          className={`w-full p-3 border rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
            errors.parentName ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter parent's name"
        />
        {errors.parentName && <p className="text-sm text-red-600">{errors.parentName}</p>}
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

      <div className="space-y-2">
        <label htmlFor="uniformSize" className="block text-sm font-medium text-gray-700">
          Child's Uniform Size *
        </label>
        <select
          id="uniformSize"
          name="uniformSize"
          value={formData.uniformSize}
          onChange={handleChange}
          className={`w-full p-3 border rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
            errors.uniformSize ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select Uniform Size</option>
          <option value="XS">XS</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
          <option value="Don't need (has already)">Don't need (has already)</option>
        </select>
        <p className="text-sm text-gray-500 mt-1">Please confirm if you don't need one - refund of $25.00 will apply</p>
        {errors.uniformSize && <p className="text-sm text-red-600">{errors.uniformSize}</p>}
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
        <label htmlFor="previousRegistration" className="block text-sm font-medium text-gray-700">
          Previous Registration Status *
        </label>
        <select
          id="previousRegistration"
          name="previousRegistration"
          value={formData.previousRegistration}
          onChange={handleChange}
          className={`w-full p-3 border rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
            errors.previousRegistration ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select Previous Registration</option>
          <option value="registered before 2020">registered before 2020</option>
          <option value="2020 SUMMER soccer">2020 SUMMER soccer</option>
          <option value="2020/2021/2023 SUMMER soccer">2020/2021/2023 SUMMER soccer</option>
          <option value="2024 SUMMER soccer">2024 SUMMER soccer</option>
          <option value="first time- never been registered before">first time- never been registered before</option>
        </select>
        {errors.previousRegistration && <p className="text-sm text-red-600">{errors.previousRegistration}</p>}
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

      <div className="flex items-start space-x-3">
        <input
          type="checkbox"
          id="newsletterSubscription"
          name="newsletterSubscription"
          checked={formData.newsletterSubscription}
          onChange={handleChange}
          className="mt-1 h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
        <label htmlFor="newsletterSubscription" className="text-sm text-gray-700">
          I agree to receive email newsletter or notifications from PanoramaHillsSoccer/CalgarySoccerStars periodically, regarding the soccer program, training sessions, cancellations and tournaments for kids
        </label>
      </div>
      <p className="text-sm text-gray-500">
        Note: If at any time you would like to unsubscribe from receiving our future emails/newsletters, unsubscribe link will be located at the bottom of each newsletter/email
      </p>
      
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
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment & Terms</h2>
      
      <div className="space-y-6">
        <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
          <div className="space-y-4">
            {formData.uniformSize === "Don't need (has already)" && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 font-medium">Uniform Discount Applied: -$25.00</p>
              </div>
            )}
            <div className="flex items-center">
              <input
                type="radio"
                id="paymentOnline"
                name="paymentMethod"
                value="online-stripe"
                checked={formData.paymentMethod === 'online-stripe'}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="paymentOnline" className="ml-3 block text-sm font-medium text-gray-700">
                Online - Stripe (${formData.uniformSize === "Don't need (has already)" ? '75.75' : '103.00'} - includes 3% service fee)
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="paymentInPerson"
                name="paymentMethod"
                value="in-person-cash-cheque"
                checked={formData.paymentMethod === 'in-person-cash-cheque'}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="paymentInPerson" className="ml-3 block text-sm font-medium text-gray-700">
                In Person - Cash/Cheque (${formData.uniformSize === "Don't need (has already)" ? '75.00' : '100.00'})
              </label>
            </div>
          </div>
          {errors.paymentMethod && <p className="mt-2 text-sm text-red-600">{errors.paymentMethod}</p>}
        </div>
        
        <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Liability Waiver</h3>
          <div className="h-40 overflow-y-auto p-4 bg-white border border-gray-200 rounded-lg mb-4 text-sm text-gray-700">
            <p className="mb-2">By participating in Panorama Hills Soccer Club activities, you acknowledge and agree to the following:</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>I understand that participation in soccer activities involves inherent risks.</li>
              <li>I accept full responsibility for any injuries or damages that may occur.</li>
              <li>I release Panorama Hills Soccer Club from any liability for injuries or damages.</li>
              <li>I confirm that the participant is in good health and fit to participate.</li>
              <li>I understand that the club has the right to refuse participation if deemed necessary.</li>
            </ol>
          </div>
          <div className="flex items-start mb-4">
            <input
              type="checkbox"
              id="liabilityAccepted"
              name="liabilityAccepted"
              checked={formData.liabilityAccepted}
              onChange={handleChange}
              className="mt-1 mr-2 h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="liabilityAccepted" className="text-gray-700">
              I have read and accept the liability waiver *
            </label>
          </div>
          {errors.liabilityAccepted && <p className="mt-1 text-sm text-red-600">{errors.liabilityAccepted}</p>}
        </div>

        <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Terms and Conditions</h3>
          <div className="h-40 overflow-y-auto p-4 bg-white border border-gray-200 rounded-lg mb-4 text-sm text-gray-700">
            <p className="mb-2">By registering with Panorama Hills Soccer Club, you agree to:</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Follow all club rules and regulations</li>
              <li>Maintain appropriate behavior during all activities</li>
              <li>Pay all fees in a timely manner</li>
              <li>Provide accurate and up-to-date information</li>
              <li>Notify the club of any changes to contact information</li>
            </ol>
          </div>
          <div className="flex items-start">
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
          onClick={handleSubmit}
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
      {/* Intro Modal */}
      {showIntroModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-8 relative">
            <h2 className="text-2xl font-bold mb-4 text-primary-700 text-center">Registration is a 3-stage process</h2>
            <ol className="list-decimal pl-5 mb-4 text-gray-700 space-y-2">
              <li><b>1st Stage:</b> Provide and submit registration information.</li>
              <li><b>2nd Stage:</b> You must <b>ACCEPT</b> a release of liability statement.</li>
              <li><b>3rd Stage:</b> Finally, payment must be received. Upon successful completion of the first and second stage you will be given the option to pay online. </li>
            </ol>
            <div className="mb-4 text-gray-700">
            </div>
            <div className="mb-4 text-gray-700">
              If you choose not to pay online please contact us to make alternate arrangements for payment.<br/>
              <b>Please note that registration is only complete upon receipt of payment.</b>
            </div>
            <div className="mb-4 text-gray-700 text-sm">
              ALL PROGRAMS ARE SUBJECT TO MINIMUM NUMBER OF PLAYERS …during the program we might experience shortage of space but all sessions will be fulfilled/held
            </div>
            <button
              className="w-full mt-4 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-300"
              onClick={() => setShowIntroModal(false)}
            >
              Continue
            </button>
          </div>
        </div>
      )}
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