'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react'

export default function CostSharingPolicy() {
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
            Cost-Sharing Policy
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
            <strong>Effective Date:</strong> January 1, 2025<br />
            <strong>Last Updated:</strong> October 30, 2025
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4" id="overview">Overview</h2>
            <p className="text-gray-700 leading-relaxed">
              Ribit is a cost-sharing rideshare platform where drivers can receive contributions that do <strong>not exceed their actual costs</strong> for providing a trip. This cost-sharing model ensures that Ribit is not classified as a Transportation Network Company (TNC) under Florida law and maintains compliance with federal tax regulations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4" id="maximum-contribution-rate">Maximum Contribution Rate</h2>
            <div className="bg-[#5DBE62]/10 border-l-4 border-[#5DBE62] p-6 rounded-lg mb-4">
              <p className="text-xl font-bold text-gray-900 mb-2">70 cents per mile or less</p>
              <p className="text-gray-700 leading-relaxed">
                This is the 2025 federal standard business mileage rate established by the IRS. This rate represents the full cost of operating a vehicle including:
              </p>
            </div>
            <ul className="list-disc list-inside space-y-2 text-gray-700 leading-relaxed ml-4">
              <li>Fuel/gasoline</li>
              <li>Routine maintenance and repairs</li>
              <li>Tire wear and replacement</li>
              <li>Insurance</li>
              <li>Vehicle depreciation</li>
              <li>Registration and licensing fees</li>
              <li>Oil changes and fluids</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4" id="how-contributions-work">How Driver Contributions Work</h2>

            <h3 className="text-xl font-bold text-gray-900 mb-3">Setting Your Rate</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 leading-relaxed mb-6">
              <li>Drivers may set contributions up to a maximum of <strong>70 cents per mile</strong></li>
              <li>Drivers may choose lower rates (e.g., 50¢, 60¢, or 65¢ per mile)</li>
              <li>Additional direct costs may be shared proportionally:
                <ul className="list-disc list-inside ml-6 mt-2">
                  <li><strong>Tolls:</strong> Actual toll costs divided by number of passengers</li>
                  <li><strong>Parking:</strong> Actual parking fees divided by number of passengers</li>
                </ul>
              </li>
            </ul>

            <h3 className="text-xl font-bold text-gray-900 mb-3">Prohibited Practices</h3>
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg mb-4">
              <div className="flex items-start mb-3">
                <XCircle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0 mt-1" />
                <p className="font-bold text-gray-900">DO NOT:</p>
              </div>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-9">
                <li>Charge more than 70 cents per mile</li>
                <li>Add &ldquo;convenience fees&rdquo; or surcharges</li>
                <li>Use surge pricing or dynamic pricing</li>
                <li>Charge booking fees to riders</li>
                <li>Profit from rides</li>
              </ul>
            </div>

            <div className="bg-green-50 border-l-4 border-[#5DBE62] p-6 rounded-lg">
              <div className="flex items-start mb-3">
                <CheckCircle className="h-6 w-6 text-[#5DBE62] mr-3 flex-shrink-0 mt-1" />
                <p className="font-bold text-gray-900">DO:</p>
              </div>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-9">
                <li>Keep contributions at or below actual costs</li>
                <li>Split tolls and parking fairly among all passengers</li>
                <li>Be transparent about your rate calculation</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4" id="why-this-matters">Why This Matters</h2>

            <h3 className="text-xl font-bold text-gray-900 mb-3">Legal Compliance</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 leading-relaxed mb-6">
              <li>Staying at or below the federal mileage rate keeps Ribit classified as <strong>cost-sharing</strong>, not commercial transportation</li>
              <li>This exempts drivers from TNC background checks, commercial insurance requirements, and for-hire vehicle regulations</li>
              <li>Maintains compliance with IRS guidelines for cost reimbursement</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-900 mb-3">Tax Implications</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 leading-relaxed">
              <li>Contributions received at or below the federal rate are generally not considered taxable income</li>
              <li>Drivers should consult a tax professional for their specific situation</li>
              <li>Keep records of actual vehicle expenses for tax purposes</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4" id="examples">Examples of Compliant Cost-Sharing</h2>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-4">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Example 1: Gainesville to Orlando (85 miles)</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Distance-based contribution: <strong>85 miles × $0.70 = $59.50 maximum</strong></li>
                <li>• With 2 riders: <strong>$29.75 per rider</strong></li>
                <li>• Plus tolls (if any): Actual toll cost ÷ 2 riders</li>
              </ul>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Example 2: UF to Tampa (125 miles)</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Distance-based contribution: <strong>125 miles × $0.65 = $81.25</strong> (driver chose lower rate)</li>
                <li>• With 3 riders: <strong>$27.08 per rider</strong></li>
                <li>• Plus parking: Actual parking cost ÷ 3 riders</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4" id="faq">Frequently Asked Questions</h2>

            <div className="space-y-6">
              <div>
                <p className="font-bold text-gray-900 mb-2">Q: Can I charge less than 70 cents per mile?</p>
                <p className="text-gray-700 leading-relaxed">A: Yes! You can set any rate up to 70 cents per mile. Many drivers choose 50-65 cents per mile.</p>
              </div>

              <div>
                <p className="font-bold text-gray-900 mb-2">Q: What about wear and tear on my car?</p>
                <p className="text-gray-700 leading-relaxed">A: The 70-cent federal rate already includes depreciation, maintenance, and wear costs.</p>
              </div>

              <div>
                <p className="font-bold text-gray-900 mb-2">Q: Can I charge for my time?</p>
                <p className="text-gray-700 leading-relaxed">A: No. Cost-sharing only covers vehicle operating expenses, not time or labor.</p>
              </div>

              <div>
                <p className="font-bold text-gray-900 mb-2">Q: What if gas prices are higher than the federal rate assumes?</p>
                <p className="text-gray-700 leading-relaxed">A: The 70-cent rate is designed to cover all costs on average. You cannot exceed this rate even if your local gas prices are high.</p>
              </div>

              <div>
                <p className="font-bold text-gray-900 mb-2">Q: Do I report this as income on my taxes?</p>
                <p className="text-gray-700 leading-relaxed">A: Generally, true cost reimbursements are not taxable income. Consult a tax professional for your situation.</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4" id="annual-rate-updates">Annual Rate Updates</h2>
            <p className="text-gray-700 leading-relaxed">
              The federal mileage rate changes annually (usually announced in December for the following year). Ribit will update this policy when new federal rates are published. Current drivers will be notified of any changes through the app.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4" id="questions">Questions?</h2>
            <p className="text-gray-700 leading-relaxed">
              Contact Ribit Support at <a href="mailto:ribitapp@gmail.com" className="text-[#5DBE62] hover:text-[#7FB069] underline font-bold">ribitapp@gmail.com</a> if you have questions about cost-sharing compliance.
            </p>
          </section>

          <hr className="my-8 border-gray-300" />

          <p className="text-gray-600 text-sm italic">
            This policy helps ensure Ribit remains a legal cost-sharing platform and that all users comply with applicable laws. Ribit is not providing tax or legal advice – consult professionals for your specific situation.
          </p>
        </motion.div>
      </article>
    </main>
  )
}
