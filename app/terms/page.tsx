'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header with brand color */}
      <header className="bg-gradient-to-br from-[#88C5A3] to-[#7FB069] py-8">
        <div className="container mx-auto px-4">
          <Link
            href="/"
            className="inline-flex items-center text-white hover:text-gray-100 transition-colors mb-4"
            aria-label="Return to homepage"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span>Back to Home</span>
          </Link>
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Terms of Service
          </motion.h1>
        </div>
      </header>

      {/* Main content */}
      <article className="container mx-auto px-4 py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="text-lg text-gray-700 mb-6">
            <strong>Last modified:</strong> October 30, 2025<br />
            <strong>Contact:</strong> <a href="mailto:ribitapp@gmail.com" className="text-[#5DBE62] hover:text-[#7FB069] underline">ribitapp@gmail.com</a><br />
            <strong>Company:</strong> Ribit Technologies, Inc.
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4" id="important-legal-notice">Important Legal Notice</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Ribit is a cost‑sharing ride coordination platform, not a Transportation Network Company (&ldquo;TNC&rdquo;). Under Florida law, a &ldquo;prearranged ride&rdquo; for TNC purposes does not include ridesharing, carpooling, or any other service in which the driver&rsquo;s fee does not exceed the driver&rsquo;s cost to provide the ride. Ribit facilitates cost‑sharing between drivers and riders; drivers on Ribit must not earn more than their reasonable pro‑rata costs for a trip. As such, Ribit is not a TNC and is not subject to Florida&rsquo;s TNC‑specific statutes that apply to Uber/Lyft‑style for‑hire transportation.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              By using the Ribit mobile application (the &ldquo;Application&rdquo;) and related services (collectively, the &ldquo;Services&rdquo;), you agree to these Terms of Service (the &ldquo;Terms&rdquo;). If you do not agree, do not use the Application.
            </p>
            <p className="text-gray-700 leading-relaxed">
              You must be at least 18 years old to use Ribit.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4" id="what-ribit-is">1. What Ribit Is (and Is Not)</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>1.1</strong> Ribit connects individuals to coordinate shared trips where riders contribute toward a driver&rsquo;s costs (e.g., fuel, tolls, parking, routine wear). Ribit is not a common carrier, taxicab, livery, charter, or for‑hire transportation provider.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>1.2</strong> Drivers are private individuals using their personal vehicles and personal insurance. Drivers are independent users and are not employees, agents, representatives, or contractors of Ribit. Ribit does not supervise, control, or direct drivers&rsquo; operations, schedules, routes, or conduct. Each driver is solely responsible for maintaining adequate insurance, complying with all applicable laws, and ensuring vehicle safety.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>1.3 Cost‑Share Rule.</strong> Drivers may only receive contributions that do not exceed their reasonable costs for a given trip. Examples include fuel, tolls, parking, and reasonable per‑mile cost of vehicle operation. Drivers must not profit from trips, set surge pricing, or operate as for‑hire transportation.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>1.4 No TNC Status.</strong> Because contributions are capped at cost, Ribit and its users are not engaged in TNC &ldquo;prearranged rides.&rdquo; TNC‑specific requirements (e.g., TNC background checks, TNC vehicle inspections, TNC commercial insurance minimums) do not apply to Ribit&rsquo;s cost‑sharing trips. This does not eliminate normal obligations under general traffic, insurance, and safety laws that apply to all motorists.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4" id="eligibility-and-accounts">2. Eligibility and Accounts</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>2.1 Age.</strong> You represent and warrant that you are 18 or older.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>2.2 Account Security.</strong> You are responsible for account activity and for safeguarding credentials. Notify <a href="mailto:ribitapp@gmail.com" className="text-[#5DBE62] hover:text-[#7FB069] underline">ribitapp@gmail.com</a> of unauthorized access.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>2.3 Truthful Information.</strong> You agree to provide accurate information and keep it updated.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4" id="driver-responsibilities">3. Driver Responsibilities</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>3.1 Lawful Driving.</strong> Obey all laws, including licensing, registration, insurance, seat‑belt/child‑restraint, and traffic rules.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>3.2 Insurance.</strong> You must have and maintain appropriate insurance coverage for all rides and any accidents that may occur during a ride, including without limitation personal injury protection insurance coverage for your vehicle with no less than the minimum limits required by applicable law. You are solely responsible for ensuring your insurance policy covers cost‑sharing rideshare activities, for verifying coverage with your insurer before offering rides, and for complying with all policy terms and conditions. Insurance coverage is your responsibility; Ribit does not provide insurance for drivers or vehicles.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>3.3 Vehicle Condition.</strong> Use a roadworthy vehicle maintained in safe operating condition.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>3.4 No For‑Hire Conduct.</strong> Do not solicit or provide transportation for profit, do not meter or surge prices, do not repeatedly operate trips that would constitute for‑hire service.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>3.5 Cost Calculation.</strong> Set contributions transparently and reasonably to reflect trip costs; do not exceed cost. Upon request from Ribit or a rider, provide a simple breakdown (e.g., miles x per‑mile cost, fuel/tolls/parking).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4" id="rider-responsibilities">4. Rider Responsibilities</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>4.1 Shared Cost.</strong> Riders contribute toward trip costs displayed in the Application.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>4.2 Conduct.</strong> Be punctual, respectful, and comply with safety requirements (seat belts, no open containers, etc.). Riders are responsible for any damage to the driver&rsquo;s vehicle or property caused by their actions or negligence.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>4.3 Personal Items.</strong> You are responsible for your belongings; Ribit is not liable for loss/damage.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>4.4 Payment Obligations.</strong> By booking a ride, you authorize Ribit to charge your payment method for the total amount shown. You agree not to dispute authorized charges or initiate fraudulent chargebacks.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>4.5 Rider Liability.</strong> Riders assume all risks associated with ridesharing and acknowledge that drivers are private individuals, not professional transportation providers. You agree to indemnify and hold harmless Ribit, the driver, and all related parties from any claims arising from your participation in a trip, including property damage, personal injury, or misconduct.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4" id="payments-fees-refunds">5. Payments, Fees, and Refunds</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>5.1 Contributions.</strong> Ribit processes rider contributions through third‑party payment processors (e.g., Stripe) and remits net amounts to drivers via their selected payment method (PayPal, Venmo, or Zelle). Ribit may charge a platform fee to defray operating costs. The platform fee does not convert trips into for‑hire service. Payment processing fees charged by third parties are non‑refundable.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>5.2 Timing.</strong> Driver payouts generally occur within approximately 72 hours after trip completion, subject to successful payment processing and verification.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>5.3 Cancellations/Refunds.</strong> Unless otherwise shown in‑app: full refund up to 24 hours before departure (less platform fees and payment processing fees); 50% refund if canceled within 24 hours (less fees); no refund if canceled within 30 minutes of departure or no‑show. If a driver cancels within 24 hours, rider receives a full refund of contribution and platform fee (payment processing fees are non‑refundable).
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>5.4 Payment Disputes and Chargebacks.</strong> You agree not to initiate chargebacks or payment disputes for authorized transactions. Unauthorized chargebacks or false payment disputes may result in immediate account termination and liability for all costs, fees, and damages incurred by Ribit. If a chargeback or payment dispute results in a loss to Ribit or a driver, you agree to reimburse all amounts, plus administrative fees and costs. Ribit reserves the right to withhold payments, suspend accounts, or take legal action to recover losses from fraudulent disputes.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>5.5 Payment Processing Disclaimer.</strong> Ribit uses third‑party payment processors and is not responsible for payment processing errors, delays, failures, or disputes between users and payment processors. You agree that payment processors&rsquo; terms govern the processing of payments.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4" id="safety-and-screening">6. Safety and Screening</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>6.1 User Responsibility.</strong> Ribit does not conduct or guarantee background checks, driving record checks, or insurance verification. Any document review performed by Ribit is for platform integrity only and does not constitute an endorsement, guarantee, or verification of insurance coverage, driver qualifications, or vehicle safety. Users are solely responsible for their own evaluation and due diligence regarding co‑riders and drivers, and may choose not to proceed with any trip.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>6.2 Optional Verifications.</strong> Ribit may offer optional identity, document, or driver‑status verifications for user trust and safety. Such features are not endorsements or guarantees.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>6.3 Zero‑Tolerance Policy.</strong> Impaired driving and threatening/violent behavior are strictly prohibited. Report safety concerns to local authorities and to <a href="mailto:ribitapp@gmail.com" className="text-[#5DBE62] hover:text-[#7FB069] underline">ribitapp@gmail.com</a>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4" id="disclaimers-allocation-risk">7. Disclaimers and Allocation of Risk</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>7.1 No Warranty.</strong> The Services are provided &ldquo;as is&rdquo; and &ldquo;as available.&rdquo; Ribit disclaims implied warranties of merchantability, fitness for a particular purpose, and non‑infringement.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>7.2 Third‑Party Content.</strong> Ribit is not responsible for user content or third‑party links.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>7.3 Assumption of Risk.</strong> Ride‑sharing involves inherent risks, including but not limited to risks of property damage, bodily injury, or death. By using Ribit, you knowingly and voluntarily assume all risks arising from interactions and travel with other users, including risks related to driver qualifications, vehicle condition, insurance coverage, and road safety. You acknowledge that Ribit does not guarantee the insurance coverage of any driver or vehicle.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4" id="limitation-liability-indemnity">8. Limitation of Liability; Indemnity</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>8.1 Limitation.</strong> To the maximum extent allowed by law, Ribit and its affiliates will not be liable for indirect, incidental, special, consequential, exemplary, or punitive damages.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>8.2 Cap.</strong> To the extent not prohibited by law, Ribit&rsquo;s aggregate liability will not exceed the greater of $100 or the amounts paid by you to Ribit for Services in the 12 months preceding the claim.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>8.3 Indemnity.</strong> You agree to indemnify, defend, and hold harmless Ribit, its affiliates, officers, directors, employees, and agents from and against any and all claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys&rsquo; fees) arising out of or relating to: (a) your use of the Services; (b) your conduct as a driver or rider; (c) any trip you participate in; (d) your breach of these Terms or violation of any law; (e) any accident, injury, or property damage occurring during a trip; (f) your insurance coverage or lack thereof; or (g) any dispute between you and another user.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4" id="intellectual-property-content">9. Intellectual Property; Content</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>9.1 Your Content.</strong> You grant Ribit a non‑exclusive license to host and display content you submit to operate the Services.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>9.2 IP Rights.</strong> The Application and content are owned by Ribit or licensors. No rights are granted except as expressly stated.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>9.3 DMCA.</strong> Send copyright notices to <a href="mailto:ribitapp@gmail.com" className="text-[#5DBE62] hover:text-[#7FB069] underline">ribitapp@gmail.com</a>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4" id="disputes-between-users">10. Disputes Between Users</h2>
            <p className="text-gray-700 leading-relaxed">
              Drivers and riders are solely responsible for resolving trip‑related disputes. Ribit may, but is not obligated to, assist with payment issues in its discretion.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4" id="termination-account-suspension">11. Termination and Account Suspension</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>11.1 Right to Terminate.</strong> Ribit reserves the right, in its sole discretion, to refuse service, terminate accounts, remove or edit content, deny driver applications, revoke driver status, or cancel bookings at any time for any reason or no reason, including but not limited to violations of these Terms, unsafe conduct, fraud, legal risk, suspicious activity, or business reasons.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>11.2 Immediate Suspension.</strong> Ribit may immediately suspend or terminate access without prior notice for: safety violations, fraudulent activity, payment disputes, chargebacks, violation of cost‑sharing rules, or conduct that poses risk to users or Ribit.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>11.3 Effect of Termination.</strong> Upon termination, your right to use the Services ceases immediately. Ribit may withhold pending payments if termination is for cause. Sections 7, 8, 11.3, and 12 survive termination.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4" id="dispute-resolution-arbitration">12. Dispute Resolution and Arbitration</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>12.1 Informal Resolution.</strong> Before filing a claim, you agree to contact Ribit at <a href="mailto:ribitapp@gmail.com" className="text-[#5DBE62] hover:text-[#7FB069] underline">ribitapp@gmail.com</a> to attempt to resolve the dispute informally for at least 30 days.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>12.2 Binding Arbitration.</strong> If informal resolution fails, you agree that any dispute, claim, or controversy arising out of or relating to these Terms or the Services shall be resolved by binding arbitration administered by the American Arbitration Association (AAA) under its Consumer Arbitration Rules, rather than in court. The arbitration will be conducted in Gainesville, Florida, or remotely by video conference.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>12.3 Class Action Waiver.</strong> YOU AND RIBIT AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN YOUR OR ITS INDIVIDUAL CAPACITY AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS OR REPRESENTATIVE ACTION. The arbitrator may not consolidate more than one person&rsquo;s claims and may not preside over any form of representative or class proceeding.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>12.4 Exceptions.</strong> Either party may seek injunctive relief in court for: (a) intellectual property infringement; (b) unauthorized access to the Services; or (c) violations of these Terms that threaten safety or security.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>12.5 Arbitration Costs.</strong> Each party bears its own costs. If you cannot afford arbitration fees, Ribit will pay them upon request, subject to AAA rules.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4" id="governing-law-venue">13. Governing Law and Venue</h2>
            <p className="text-gray-700 leading-relaxed">
              Florida law governs these Terms without regard to conflict of law principles. To the extent arbitration does not apply, exclusive venue lies in state or federal courts located in Gainesville, Florida, and you consent to personal jurisdiction there.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4" id="changes-to-terms">14. Changes to These Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              Ribit may update these Terms by posting revised terms. Continued use after posting constitutes acceptance.
            </p>
          </section>

          <hr className="my-8 border-gray-300" />

          <p className="text-center text-gray-600 text-sm">
            © 2025 Ribit Technologies, Inc. All Rights Reserved.
          </p>
        </motion.div>
      </article>
    </main>
  )
}
