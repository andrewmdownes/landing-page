'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function PrivacyPolicy() {
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
            Privacy Policy
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4" id="overview">Overview</h2>
            <p className="text-gray-700 leading-relaxed">
              This Privacy Policy explains how Ribit Technologies, Inc. (&ldquo;Ribit&rdquo;) collects, uses, discloses, and safeguards information when you use our mobile application and related services (the &ldquo;Services&rdquo;). Ribit operates a cost‑sharing rideshare coordination platform and is not a Transportation Network Company (TNC). Because drivers receive contributions that do not exceed the driver&rsquo;s cost for a trip, Ribit&rsquo;s operations are exempt from Florida&rsquo;s TNC‑specific regime. This Privacy Policy applies to all users (drivers and riders) age 18+ located in the United States.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4" id="information-we-collect">Information We Collect</h2>
            <ol className="list-decimal list-inside space-y-3 text-gray-700 leading-relaxed">
              <li><strong>Account Information:</strong> name, email, phone number, date of birth, university affiliation (if provided), profile information.</li>
              <li><strong>Driver Information</strong> (if you offer rides): vehicle make/model, license plate, car color, driver&rsquo;s license, insurance documents, vehicle registration, payment information (PayPal, Venmo, or Zelle), and other details you choose to provide.</li>
              <li><strong>Trip and Transaction Data:</strong> trip origin/destination areas, dates/times, contribution amounts, payments, payout identifiers.</li>
              <li><strong>Communications:</strong> messages sent via the app and communications with support.</li>
              <li><strong>Device/Usage Data:</strong> IP address, device identifiers, app events, and diagnostic logs.</li>
              <li><strong>Location Data:</strong> with your permission, approximate or precise location to enable trip coordination, safety features, and operational analytics.</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4" id="how-we-use-information">How We Use Information</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 leading-relaxed">
              <li>Provide, operate, and improve the Services (matching, messaging, payments).</li>
              <li>Display trip details and facilitate cost‑sharing contributions.</li>
              <li>Detect, prevent, and investigate fraud, abuse, or safety incidents.</li>
              <li>Communicate service updates, policy changes, and support responses.</li>
              <li>Comply with legal obligations and enforce our Terms.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4" id="cost-sharing-transparency">Cost‑Sharing and Transparency</h2>
            <p className="text-gray-700 leading-relaxed">
              To preserve Ribit&rsquo;s non‑TNC status, Ribit may display or store cost‑share calculations and parameters (e.g., per‑mile estimates, tolls/parking) and retain records of contribution amounts to demonstrate that driver receipts do not exceed reasonable trip cost. Ribit may collect and review driver documents (including insurance, license, and registration) for platform integrity, but such review does not constitute verification, endorsement, or guarantee of insurance coverage, driver qualifications, or vehicle safety.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4" id="payments">Payments</h2>
            <p className="text-gray-700 leading-relaxed">
              Ribit uses third‑party payment processors for contributions and payouts. Payment credentials are tokenized and stored by processors, not Ribit. The processors&rsquo; privacy practices govern their handling of your financial data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4" id="data-sharing">Data Sharing</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 leading-relaxed">
              <li>With counterparties to a trip (e.g., first name, relevant profile and trip details, limited location sharing for pickup/route).</li>
              <li>With service providers (cloud hosting, analytics, payments, communications) bound by confidentiality obligations.</li>
              <li>For legal compliance and safety (e.g., responding to lawful requests, preventing harm, investigating misuse).</li>
              <li>In a corporate transaction (merger, acquisition), subject to standard successor obligations.</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Ribit does not sell personal information. Ribit may use aggregated or de‑identified data for analytics, reporting, and product development.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4" id="your-choices-rights">Your Choices & Rights</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 leading-relaxed">
              <li><strong>Location:</strong> control via device settings; certain features require location.</li>
              <li><strong>Communications:</strong> manage email and notification preferences; essential service messages may still be sent.</li>
              <li><strong>Access/Deletion:</strong> request a copy or deletion of your data at <a href="mailto:ribitapp@gmail.com" className="text-[#5DBE62] hover:text-[#7FB069] underline">ribitapp@gmail.com</a> (subject to legal/operational retention needs such as fraud prevention, accounting, and regulatory compliance).</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              If you are a California resident, you may exercise rights of access, deletion, and non‑discrimination consistent with the CCPA. If you are in the EEA/UK, you may have GDPR rights (access, rectification, deletion, portability, restriction, objection). Because Ribit serves U.S. users, processing is primarily U.S.‑based; requests are honored as applicable.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4" id="data-retention-security">Data Retention & Security</h2>
            <p className="text-gray-700 leading-relaxed">
              Ribit retains data for as long as necessary to provide the Services, maintain safety/fraud records, comply with legal obligations, and evidence cost‑sharing compliance. Technical, administrative, and physical safeguards are used; no method is 100% secure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4" id="children">Children</h2>
            <p className="text-gray-700 leading-relaxed">
              Ribit is for users 18+. We do not knowingly collect data from minors.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4" id="changes-to-policy">Changes to This Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Policy periodically. Material changes will be noted in‑app or via email where appropriate. Continued use after the effective date indicates acceptance.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4" id="contact">Contact</h2>
            <p className="text-gray-700 leading-relaxed">
              Ribit Technologies, Inc.<br />
              Email: <a href="mailto:ribitapp@gmail.com" className="text-[#5DBE62] hover:text-[#7FB069] underline">ribitapp@gmail.com</a>
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
