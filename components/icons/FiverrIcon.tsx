import React from 'react';

// A simplified icon representing Fiverr, using 'Fv'
export const FiverrIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M9 8h5" />
    <path d="M9 12h3" />
    <path d="M9 8v8" />
    <path d="M14.5 12l-2.5 4" />
    <path d="M17 8l-2.5 4" />
  </svg>
);
