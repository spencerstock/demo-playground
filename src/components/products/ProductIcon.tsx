import Image from 'next/image';

interface ProductIconProps {
  icon: string;
  className?: string;
}

export function ProductIcon({ icon, className = '' }: ProductIconProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      {icon === 'signin' && (
        <Image src="/sign-in-with-base-logo.svg" alt="Sign in with Base" width={48} height={48} />
      )}
      {icon === 'payment' && (
        <Image src="/base-pay-logo.svg" alt="Base Pay" width={48} height={48} />
      )}
      {icon === 'transaction' && (
        <Image src="/export-logo.png" alt="Transact" width={48} height={48} />
      )}
    </div>
  );
}
