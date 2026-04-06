import React from 'react';

const Logo = ({ size = 32, color = 'currentColor', ...props }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 64 64" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {/* Ground line */}
    <rect x="4" y="58" width="56" height="2" fill={color}/>
    
    {/* Store Front */}
    <rect x="10" y="30" width="44" height="28" fill={color}/>
    
    {/* Door (Arched) */}
    <path d="M14 38C14 34.6863 16.6863 32 20 32C23.3137 32 26 34.6863 26 38V54H14V38Z" fill="white"/>
    <rect x="16" y="50" width="8" height="4" fill={color}/>
    <rect x="18" y="38" width="4" height="8" fill={color} fillOpacity="0.1"/>

    {/* Window */}
    <rect x="28" y="34" width="22" height="18" fill="white"/>
    <rect x="28" y="52" width="22" height="2" fill={color}/>

    {/* Awning Structure */}
    <rect x="8" y="20" width="48" height="12" fill={color}/>
    
    {/* Striped Awning */}
    <rect x="12" y="20" width="6" height="12" fill="white"/>
    <rect x="24" y="20" width="6" height="12" fill="white"/>
    <rect x="36" y="20" width="6" height="12" fill="white"/>
    <rect x="48" y="20" width="4" height="12" fill="white"/>

    {/* Scallops */}
    <circle cx="12" cy="32" r="4" fill={color}/>
    <circle cx="20" cy="32" r="4" fill={color}/>
    <circle cx="28" cy="32" r="4" fill={color}/>
    <circle cx="36" cy="32" r="4" fill={color}/>
    <circle cx="44" cy="32" r="4" fill={color}/>
    <circle cx="52" cy="32" r="4" fill={color}/>
  </svg>
);

export default Logo;
