// components/AppDownload.tsx
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { QRCodeSVG } from 'qrcode.react'
import { AiOutlineApple } from "react-icons/ai"
import { useState, useEffect } from 'react'


interface AppDownloadProps {
  variant?: 'default' | 'white'
  buttonGradient?: {
    from: string
    to: string
  }
  buttonColor?: string // Solid color option
}

export default function AppDownload({ variant = 'default', buttonGradient, buttonColor }: AppDownloadProps) {
  const isWhite = variant === 'white'
  const [qrSize, setQrSize] = useState(160)
  
  // Handle responsive QR code size
  useEffect(() => {
    const updateQrSize = () => {
      setQrSize(window.innerWidth >= 640 ? 160 : 140)
    }
    updateQrSize()
    window.addEventListener('resize', updateQrSize)
    return () => window.removeEventListener('resize', updateQrSize)
  }, [])
  
  // Use solid color if provided, otherwise use gradient
  const useSolidColor = !!buttonColor
  const gradientFrom = buttonGradient?.from || '#88C5A3'
  const gradientTo = buttonGradient?.to || '#7FB069'
  const solidColor = buttonColor || '#7FB069'
  const shadowColor = useSolidColor ? solidColor : (buttonGradient?.to || '#7FB069')
  
  // Convert hex to rgba for shadow
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }
  
  // Determine background style
  const backgroundStyle = useSolidColor 
    ? solidColor 
    : `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`

  const appStoreUrl = "https://apps.apple.com/us/app/ribit-share-rides/id6752734297"

  const AppleLogo = ({ className }: { className?: string }) => (
    <AiOutlineApple className={className || "h-6 w-6"} />
  )

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-2xl mx-auto"
    >
      <div className="bg-white rounded-2xl p-6 md:p-4 shadow-xl flex flex-col md:flex-row items-center gap-6 md:gap-4">
        {/* QR Code Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex-shrink-0 flex flex-col items-center"
        >
          <div className="w-[140px] h-[140px] sm:w-[160px] sm:h-[160px] mb-0 flex items-center justify-center bg-white p-2 rounded-lg">
            <QRCodeSVG
              value="https://www.ribit.tech/"
              size={qrSize}
              level="H"
              includeMargin={false}
            />
          </div>
          <p className="text-xs text-gray-500 font-medium">Scan to download</p>
        </motion.div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-24 bg-gray-200 flex-shrink-0" />

        {/* Download Button */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex-1 w-full sm:w-auto mr-0 ml-0 md:mr-3 md:ml-3"
        >
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <Link 
              href={appStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center gap-4 px-7 py-5 rounded-2xl font-semibold transition-all duration-300 overflow-hidden shadow-lg text-white hover:shadow-2xl"
              style={{
                background: backgroundStyle,
                boxShadow: `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 20px 25px -5px ${hexToRgba(shadowColor, 0.3)}, 0 10px 10px -5px ${hexToRgba(shadowColor, 0.15)}`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)`
              }}
            >
              {/* Shimmer effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              
              {/* Content */}
              <div className="relative flex items-center gap-4 w-full">
                {/* Apple logo with prominent circular background */}
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-white/20 rounded-full group-hover:bg-white/30 transition-all duration-300">
                  <AppleLogo className="h-7 w-7 text-white" />
                </div>
                
                {/* Text content */}
                <div className="flex flex-col items-start flex-1">
                  <span className="text-[10px] font-normal opacity-95 leading-tight tracking-wider uppercase text-white">
                    Download on the
                  </span>
                  <p className="text-xl font-bold text-white leading-tight mt-0.5">
                    App Store
                  </p>
                </div>
                
                {/* Arrow indicator */}
                <div className="flex-shrink-0 opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                  <svg 
                    width="22" 
                    height="22" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="text-white"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>
            </Link>
          </motion.div>
          
        </motion.div>
      </div>
    </motion.div>
  )
}
