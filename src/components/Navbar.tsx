'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/home', label: '홈', icon: '🏠' },
    { href: '/fortune', label: '강아지 삼주', icon: '🔮' },
    { href: '/compatibility', label: '견주 궁합', icon: '💕' },
    { href: '/results', label: '결과 보기', icon: '📊' }
  ];

  return (
    <nav className="bg-black/90 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-md mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-white">
            <Image 
              src="/pawstars_logo.jpg" 
              alt="PawStars Logo" 
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
            PawStars
          </Link>

          {/* Navigation Items */}
          <div className="flex space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-white text-black'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="hidden sm:inline">{item.icon} </span>
                  <span className="text-xs sm:text-sm">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
