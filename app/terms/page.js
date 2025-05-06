import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';

export const metadata = {
  title: 'Terms & Conditions | Panaroma Hills Soccer Club',
  description: 'Panaroma Hills Soccer Club membership terms and conditions',
};

export default function TermsPage() {
  return (
    <div className="flex flex-col w-full">
      <Navbar />
      <div className="bg-primary-800 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Terms & Conditions</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Important information about Panaroma Hills Soccer Club membership
          </p>
        </div>
      </div>

      <section className="container mx-auto py-16 px-6 sm:px-10 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-10 sm:p-12">
            <div className="prose max-w-none prose-lg text-gray-800 space-y-8">
              <h2>1. Membership Terms</h2>
              <p>
                Panaroma Hills Soccer Club membership is valid for one year from the date of registration and payment of the appropriate membership fee. 
                Members must adhere to all club rules and regulations as set forth in this document and as updated periodically.
              </p>

              <h2>2. Registration and Payment</h2>
              <p>
                Registration is complete upon submission of the required registration form and payment of the appropriate membership fee. 
                Payment must be made in full at the time of registration. All payments are processed securely through Stripe payment gateway.
              </p>
              <p>
                Membership fees are as follows:
              </p>
              <ul>
                <li>Standard Membership: £120/year</li>
                <li>Premium Membership: £200/year</li>
                <li>Youth Membership: £80/year</li>
              </ul>

              <h2>3. Cancellations and Refunds</h2>
              <p>
                Membership fees are non-refundable except in exceptional circumstances, which will be evaluated on a case-by-case basis by 
                the club management. If a refund is approved, it may be subject to an administration fee.
              </p>
              <p>
                The club reserves the right to refuse or revoke membership without refund if a member violates the club's code of conduct 
                or engages in behavior that is detrimental to the club or its members.
              </p>

              <h2>4. Code of Conduct</h2>
              <p>
                All members must:
              </p>
              <ul>
                <li>Treat other members, coaches, officials, and opponents with respect</li>
                <li>Refrain from using abusive language or behavior</li>
                <li>Attend training sessions regularly and punctually</li>
                <li>Follow the instructions of coaches and club officials</li>
                <li>Take care of club equipment and facilities</li>
                <li>Represent the club in a positive manner both on and off the field</li>
              </ul>

              <h2>5. Health and Safety</h2>
              <p>
                Members participate in club activities at their own risk. The club is not responsible for any injuries sustained during 
                training sessions, matches, or other club events. Members are strongly encouraged to have appropriate health insurance.
              </p>
              <p>
                Members must disclose any relevant medical conditions or allergies that may affect their participation in club activities. 
                This information will be kept confidential and only shared with relevant coaches or first aid personnel as necessary.
              </p>

              <h2>6. Club Equipment and Facilities</h2>
              <p>
                Club equipment must be used responsibly and for its intended purpose. Any damage to club equipment or facilities due to 
                misuse may result in the member being held financially responsible for repairs or replacement.
              </p>
              <p>
                The club is not responsible for personal belongings left at club facilities.
              </p>

              <h2>7. Photography and Media</h2>
              <p>
                The club may take photographs or videos during training sessions, matches, and other club events for promotional purposes. 
                By becoming a member, you consent to your image being used in club publications, website, and social media.
              </p>
              <p>
                If you do not wish to be photographed or filmed, please inform the club in writing.
              </p>

              <h2>8. Data Protection</h2>
              <p>
                Personal information collected during registration will be used solely for club administration purposes and will not be 
                shared with third parties except as required by law or with your explicit consent.
              </p>
              <p>
                Members must inform the club of any changes to their personal information, including contact details and emergency contacts.
              </p>

              <h2>9. Communication</h2>
              <p>
                The club will communicate with members via email, SMS, or through the club website. It is the member's responsibility to 
                ensure that their contact details are up to date.
              </p>

              <h2>10. Changes to Terms and Conditions</h2>
              <p>
                The club reserves the right to modify these terms and conditions at any time. Any changes will be communicated to members 
                via email and posted on the club website.
              </p>

              <h2>11. Governing Law</h2>
              <p>
                These terms and conditions are governed by the laws of the United Kingdom.
              </p>

              <h2>Contact Information</h2>
              <p>
                If you have any questions about these terms and conditions, please contact:
              </p>
              <p>
                Panaroma Hills Soccer Club<br />
                123 Football Lane<br />
                Green Valley<br />
                London, SW1A 1AA<br />
                United Kingdom<br /><br />
                Email: info@fcgreenvalley.com<br />
                Phone: +44 (0) 123 456 7890
              </p>

              <p className="text-sm text-gray-600 mt-8">
                Last updated: May 1, 2025
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}