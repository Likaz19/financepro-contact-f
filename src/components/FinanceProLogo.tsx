export function FinanceProLogo({ className = "h-24 w-auto" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 400 400" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="200" cy="200" r="140" fill="none" stroke="#1E88E5" strokeWidth="4"/>
      <circle cx="200" cy="200" r="155" fill="none" stroke="#0B3D91" strokeWidth="3"/>
      
      <rect x="145" y="205" width="25" height="60" fill="#0B3D91" rx="3"/>
      <rect x="185" y="175" width="25" height="90" fill="#1E88E5" rx="3"/>
      <rect x="225" y="145" width="25" height="120" fill="#0B3D91" rx="3"/>
      
      <path 
        d="M 130 180 Q 150 165 170 170 Q 190 175 200 160 Q 210 145 230 150 Q 250 155 270 145" 
        stroke="#1E88E5" 
        strokeWidth="6" 
        fill="none" 
        strokeLinecap="round"
      />
      
      <path 
        d="M 245 125 L 275 155" 
        stroke="#0B3D91" 
        strokeWidth="8" 
        strokeLinecap="round"
      />
      <path 
        d="M 275 155 L 260 170" 
        stroke="#0B3D91" 
        strokeWidth="8" 
        strokeLinecap="round"
      />
      
      <path 
        d="M 80 240 Q 120 200 200 230 Q 280 260 320 220" 
        stroke="#1E88E5" 
        strokeWidth="12" 
        fill="none" 
        strokeLinecap="round"
        opacity="0.6"
      />
      
      <path 
        d="M 90 260 Q 140 220 200 250 Q 260 280 310 240" 
        stroke="#0B3D91" 
        strokeWidth="14" 
        fill="none" 
        strokeLinecap="round"
        opacity="0.4"
      />
      
      <text 
        x="50" 
        y="200" 
        fontFamily="Arial, sans-serif" 
        fontSize="38" 
        fontWeight="bold" 
        fill="#0B3D91" 
        transform="rotate(-90 50 200)"
      >
        FINANCEPRO
      </text>
      
      <text 
        x="350" 
        y="200" 
        fontFamily="Arial, sans-serif" 
        fontSize="32" 
        fontWeight="bold" 
        fill="#1E88E5" 
        transform="rotate(90 350 200)"
      >
        CONSULTING
      </text>
    </svg>
  )
}
