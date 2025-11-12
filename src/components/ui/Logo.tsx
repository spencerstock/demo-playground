import Image from 'next/image';

export function Logo({ variant = 'demo' }: { variant?: 'demo' | 'account' }) {
  return (
    <div className="flex items-center gap-2">
      <Image
        src="/logo.png"
        alt={variant === 'account' ? 'Account Demo Logo' : 'Demo Logo'}
        width={120}
        height={40}
        priority
      />
    </div>
  );
}
