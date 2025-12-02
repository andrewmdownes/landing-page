// components/AppDownloadButton.tsx
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { AiOutlineApple } from "react-icons/ai"

interface AppDownloadButtonProps {
  buttonColor?: string // Kept for backwards compatibility but not used
}

export default function AppDownloadButton({ buttonColor }: AppDownloadButtonProps) {
  const appStoreUrl = "https://apps.apple.com/us/app/ribit-share-rides/id6752734297"

  const AppleLogo = ({ className }: { className?: string }) => (
    <AiOutlineApple className={className || "h-6 w-6"} />
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="inline-block"
    >
      <Link 
        href={appStoreUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative inline-flex items-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all duration-300 overflow-hidden shadow-lg bg-white hover:shadow-2xl hover:shadow-white/20"
      >
        {/* Shimmer effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#88C5A3]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        
        {/* Content */}
        <div className="relative flex items-center gap-3">
          {/* Apple logo */}
          <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 bg-[#88C5A3]/10 rounded-full group-hover:bg-[#88C5A3]/20 transition-all duration-300">
            <AppleLogo className="h-6 w-6 text-[#88C5A3]" />
          </div>
          
          {/* Text content */}
          <div className="flex flex-col items-start">
            <span className="text-[10px] font-normal opacity-75 leading-tight tracking-wider uppercase text-gray-600">
              Download on the
            </span>
            <span className="text-lg font-bold text-[#88C5A3] leading-tight">
              App Store
            </span>
          </div>
          
          {/* Arrow indicator */}
          <div className="flex-shrink-0 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="text-[#88C5A3]"
            >
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

