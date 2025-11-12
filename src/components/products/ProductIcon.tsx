import Image from 'next/image';

interface ProductIconProps {
  icon: string;
  className?: string;
}

export function ProductIcon({ icon, className = '' }: ProductIconProps) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {icon === 'signin' && (
        <>
          <Image 
            src="/sign-in-with-base-logo.svg" 
            alt="Sign in with Base" 
            width={48} 
            height={48}
            className="group-hover:opacity-0 transition-opacity duration-150"
          />
          <Image 
            src="/sign_in_with_base_color.svg" 
            alt="Sign in with Base" 
            width={48} 
            height={48}
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
          />
        </>
      )}
      {icon === 'payment' && (
        <>
          <Image 
            src="/base-pay-logo.svg" 
            alt="Base Pay" 
            width={48} 
            height={48}
            className="group-hover:opacity-0 transition-opacity duration-150"
          />
          <Image 
            src="/base_pay_color.svg" 
            alt="Base Pay" 
            width={48} 
            height={48}
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
          />
        </>
      )}
      {icon === 'transaction' && (
        <>
          <Image 
            src="/export-logo.png" 
            alt="Transact" 
            width={48} 
            height={48}
            className="group-hover:opacity-0 transition-opacity duration-150"
          />
          <Image 
            src="/transact_color.png" 
            alt="Transact" 
            width={48} 
            height={48}
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
          />
        </>
      )}
    </div>
  );
}
