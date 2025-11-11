// app/page.tsx
'use client'

import { motion } from 'framer-motion'
import { Shield, Users, Clock, DollarSign, Car, MapPin } from 'lucide-react'
import Link from 'next/link'
import EmailSignup from '../components/EmailSignup'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#88C5A3] to-[#7FB069] text-white overflow-hidden">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-5xl mx-auto"
          >
            {/* Brand */}
            <div className="mb-8">
              <h1 className="text-5xl md:text-6xl font-bold mb-4">
                Ribit
              </h1>
              <p className="text-xl md:text-2xl font-light opacity-90">
                University ridesharing that works for everyone
              </p>
            </div>
            
            {/* Main Value Props - Split Layout */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Passenger Side */}
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-2xl p-6 shadow-xl"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-[#88C5A3]/10 rounded-full mx-auto mb-4">
                  <Users className="h-6 w-6 text-[#7FB069]" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Need a Ride?</h3>
                <p className="text-gray-600">
                  Save up to 85% on university travel. Verified students, trusted community.
                </p>
              </motion.div>

              {/* Driver Side */}
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white rounded-2xl p-6 shadow-xl"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-[#88C5A3]/10 rounded-full mx-auto mb-4">
                  <Car className="h-6 w-6 text-[#7FB069]" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Driving Home?</h3>
                <p className="text-gray-600">
                  Turn your regular trips into income. Safe rides with verified students.
                </p>
              </motion.div>
            </div>

            {/* Universal Benefits */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-8"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Perfect for Spring Break, Holidays & Campus Events
              </h2>
              <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto">
                Join the verified university community that&apos;s already planning rides for 
                the moments that matter most.
              </p>
            </motion.div>

            <EmailSignup />
            
            {/* Trust Indicators */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap justify-center items-center gap-6 mt-8 text-sm text-white/80"
            >
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>.edu verified</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>University community</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Medium-distance travel</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Ribit?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Community-based ridesharing designed specifically for university students
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Cost Effective */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center bg-white rounded-2xl p-8 shadow-lg"
            >
              <div className="bg-[#88C5A3]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <DollarSign className="h-8 w-8 text-[#7FB069]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Up to 85% Savings</h3>
              <p className="text-gray-600">
                Significantly cheaper than traditional rideshare for medium-distance trips (40-400 miles)
              </p>
            </motion.div>

            {/* Community Safety */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center bg-white rounded-2xl p-8 shadow-lg"
            >
              <div className="bg-[#88C5A3]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-[#7FB069]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Verified Community</h3>
              <p className="text-gray-600">
                .edu email verification, ID checks, and driver verification for trusted university travel
              </p>
            </motion.div>

            {/* Convenience */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center bg-white rounded-2xl p-8 shadow-lg"
            >
              <div className="bg-[#88C5A3]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="h-8 w-8 text-[#7FB069]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Perfect Timing</h3>
              <p className="text-gray-600">
                Coordinated rides for Spring Break, holidays, move-out days, and campus events
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              When University Life Takes You Places
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From semester breaks to weekend adventures, Ribit connects students heading the same direction
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { 
                icon: <MapPin className="h-8 w-8 text-[#5DBE62]" />, 
                title: 'Spring Break', 
                desc: 'Beach destinations with friends',
                popular: true
              },
              { 
                icon: <Clock className="h-8 w-8 text-[#5DBE62]" />, 
                title: 'Holiday Breaks', 
                desc: 'Thanksgiving and winter travel home',
                popular: true
              },
              { 
                icon: <Car className="h-8 w-8 text-[#5DBE62]" />, 
                title: 'Move-Out Days', 
                desc: 'End of semester relocations',
                popular: false
              },
              { 
                icon: <Users className="h-8 w-8 text-[#5DBE62]" />, 
                title: 'Campus Events', 
                desc: 'Away games and conferences',
                popular: false
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative text-center bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all group hover:-translate-y-1"
              >
                {item.popular && (
                  <div className="absolute -top-2 -right-2 bg-[#5DBE62] text-white text-xs px-2 py-1 rounded-full font-semibold">
                    Popular
                  </div>
                )}
                <div className="bg-[#5DBE62]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#5DBE62]/20 transition-colors">
                  {item.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Additional Context */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <div className="bg-gray-50 rounded-2xl p-6 max-w-4xl mx-auto">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Peak Travel Times = Peak Savings
              </h3>
              <p className="text-gray-600">
                When everyone&apos;s heading the same direction, traditional rideshare prices spike. 
                Ribit&apos;s community approach means consistent, affordable pricing when you need it most.
              </p>
              <div className="grid md:grid-cols-3 gap-4 mt-6 text-sm">
                <div className="flex items-center justify-center gap-2 text-gray-700">
                  <Shield className="h-4 w-4 text-[#5DBE62]" />
                  <span>Verified drivers & riders</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-700">
                  <Clock className="h-4 w-4 text-[#5DBE62]" />
                  <span>Planned in advance</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-700">
                  <DollarSign className="h-4 w-4 text-[#5DBE62]" />
                  <span>No surge pricing</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How Ribit Works
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-[#7FB069] text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Find or Offer Rides</h3>
              <p className="text-gray-600">Browse available rides or post your own trip</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-[#7FB069] text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Connect Safely</h3>
              <p className="text-gray-600">Verified university students only, with ratings and reviews</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-[#7FB069] text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Share & Save</h3>
              <p className="text-gray-600">Split costs and enjoy the journey with fellow students</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 bg-[#88C5A3] text-white relative overflow-hidden">
        {/* Background Pattern for Visual Interest */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 bg-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white rounded-full"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Ready to Save on Your Next Trip?
              </h2>
              <p className="text-lg md:text-xl mb-8 text-white/95">
                
              </p>
              <EmailSignup variant="white" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xl font-bold mb-2">Ribit</p>
          <p className="text-gray-400 text-sm mb-4">
            Community-based ridesharing for affordable medium-distance travel
          </p>
          <nav className="flex justify-center gap-6 mb-4" aria-label="Footer navigation">
            <Link href="/terms" className="text-gray-400 hover:text-[#5DBE62] transition-colors text-sm">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-gray-400 hover:text-[#5DBE62] transition-colors text-sm">
              Privacy Policy
            </Link>
            <Link href="/cost-sharing" className="text-gray-400 hover:text-[#5DBE62] transition-colors text-sm">
              Cost-Sharing Policy
            </Link>
          </nav>
          <p className="text-gray-500 text-xs mt-4">
            © 2025 Ribit Technologies. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}