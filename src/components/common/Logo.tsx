import React from 'react'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'light' | 'dark'
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', variant = 'dark' }) => {
  const sizeMap = {
    sm: { icon: 28, text: 'text-lg', sub: 'text-[9px]' },
    md: { icon: 36, text: 'text-xl', sub: 'text-[10px]' },
    lg: { icon: 48, text: 'text-2xl', sub: 'text-xs' }
  }

  const { icon, text, sub } = sizeMap[size]

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Abstract N Icon */}
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-300 hover:scale-105"
      >
        <defs>
          <linearGradient id="nexoraGradMain" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#13C8F4" />
            <stop offset="50%" stopColor="#087BEE" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
          <linearGradient id="nexoraBgDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#071321" />
            <stop offset="100%" stopColor="#0E233D" />
          </linearGradient>
        </defs>
        <rect width="100" height="100" rx="22" fill="url(#nexoraBgDark)" />
        <path
          d="M26 74V26L48 56V26"
          stroke="url(#nexoraGradMain)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M52 74V44L74 74V26"
          stroke="#13C8F4"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="74" cy="26" r="4.5" fill="#8B5CF6" />
      </svg>

      {/* Brand Text */}
      <div className="flex flex-col leading-none">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-black tracking-tight ${text} ${
              variant === 'light' ? 'text-white' : 'text-[#071321]'
            }`}
          >
            NEXORA
          </span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/10 text-[#087BEE] tracking-wider uppercase">
            Tech
          </span>
        </div>
        <span
          className={`font-semibold tracking-widest uppercase ${sub} ${
            variant === 'light' ? 'text-slate-400' : 'text-slate-500'
          }`}
        >
          Smart NFC + QR
        </span>
      </div>
    </div>
  )
}

