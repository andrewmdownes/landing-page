// app/page.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Shield, Users, Clock, DollarSign, ArrowRight, Car, MapPin } from 'lucide-react'
import EmailSignup from '../components/EmailSignup'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#5DBE62] to-[#4CAF50] text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="mb-6">
              <h1 className="text-5xl md:text-6xl font-bold mb-4">
                ribit
              </h1>
              <p className="text-xl md:text-2xl font-light opacity-90">
                Affordable, safe ridesharing for university travel
              </p>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Stop paying $300+ for rides home
            </h2>
            
            <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join verified university students for medium-distance trips. 
              Share rides for Spring Break, holidays, and campus events at a fraction of the cost.
            </p>

            {/* Cost Comparison */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold mb-4">Gainesville → Orlando</h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-red-500/20 rounded-lg p-4">
                  <p className="text-sm opacity-80">Uber/Lyft</p>
                  <p className="text-2xl font-bold">$300+</p>
                </div>
                <div className="bg-white/20 rounded-lg p-4">
                  <p className="text-sm opacity-80">Ribit</p>
                  <p className="text-2xl font-bold">~$45</p>
                </div>
              </div>
            </div>

            <EmailSignup />
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
              <div className="bg-[#5DBE62]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <DollarSign className="h-8 w-8 text-[#5DBE62]" />
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
              <div className="bg-[#5DBE62]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-[#5DBE62]" />
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
              <div className="bg-[#5DBE62]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="h-8 w-8 text-[#5DBE62]" />
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
              Perfect for University Life
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Whether you're heading home for the holidays or joining friends for spring break
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { icon: '🏖️', title: 'Spring Break', desc: 'Beach trips with friends' },
              { icon: '🦃', title: 'Thanksgiving', desc: 'Home for the holidays' },
              { icon: '📦', title: 'Move-Out', desc: 'End of semester moves' },
              { icon: '🏈', title: 'Game Days', desc: 'Away game adventures' }
            ].map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
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
              <div className="bg-[#5DBE62] text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
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
              <div className="bg-[#5DBE62] text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
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
              <div className="bg-[#5DBE62] text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Share & Save</h3>
              <p className="text-gray-600">Split costs and enjoy the journey with fellow students</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 bg-[#5DBE62] text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Save on Your Next Trip?
            </h2>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              Join thousands of university students who are already saving money and traveling safely with Ribit.
            </p>
            <EmailSignup variant="white" />
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xl font-bold mb-2">ribit</p>
          <p className="text-gray-400 text-sm">
            Community-based ridesharing for affordable medium-distance travel
          </p>
          <p className="text-gray-500 text-xs mt-4">
            © 2025 Ribit Technologies. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}