import Image from 'next/image';

interface ProductIconProps {
  icon: string;
  className?: string;
}

export function ProductIcon({ icon, className = '' }: ProductIconProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      {icon === 'signin' && (
        <Image 
          src="/sign-in-with-base-logo.png" 
          alt="Sign in with Base"
          width={24}
          height={24}
        />
      )}
      {icon === 'payment' && (
        <Image 
          src="/base-pay-logo.png" 
          alt="Base Pay"
          width={24}
          height={24}
        />
      )}
      {icon === 'transaction' && (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-gray-500">
          <path d="M7 7h10M7 12h10M7 17h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M17 7l3 3-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M7 17l-3-3 3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </div>
  );
}

