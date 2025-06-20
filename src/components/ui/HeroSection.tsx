'use client';

import Link from 'next/link';
import Image from 'next/image';

interface HeroSectionProps {
  title: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  backgroundImage?: string;
}

export default function HeroSection({
  title,
  description,
  primaryButtonText,
  primaryButtonLink,
  secondaryButtonText,
  secondaryButtonLink,
  backgroundImage,
}: HeroSectionProps) {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* 背景要素 */}
      <div className="absolute inset-0 z-0">
        {backgroundImage ? (
          <Image
            src={backgroundImage}
            alt="背景"
            fill
            className="object-cover opacity-10"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/5 to-accent-blue/5" />
        )}
        {/* 装飾的な円形要素 */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-accent-yellow opacity-10" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-primary opacity-5" />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 tracking-tight">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-text-dark mb-10 leading-relaxed">
            {description}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
            <Link 
              href={primaryButtonLink}
              className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all transform hover:translate-y-[-2px]"
            >
              {primaryButtonText}
            </Link>
            {secondaryButtonText && secondaryButtonLink && (
              <Link 
                href={secondaryButtonLink}
                className="bg-white border-2 border-primary text-primary hover:bg-gray-50 font-bold py-3 px-8 rounded-lg shadow-sm transition-all transform hover:translate-y-[-2px]"
              >
                {secondaryButtonText}
              </Link>
            )}
          </div>
        </div>
      </div>
      
      {/* 装飾的なアニメーション要素（簡易版）*/}
      <div className="hidden lg:block absolute bottom-0 right-0 z-0 opacity-30">
        <div className="relative w-64 h-64">
          <div className="absolute w-12 h-12 rounded-full bg-accent-blue animate-float" style={{ top: '20%', left: '10%', animationDelay: '0s' }} />
          <div className="absolute w-8 h-8 rounded-full bg-accent-yellow animate-float" style={{ top: '60%', left: '20%', animationDelay: '1s' }} />
          <div className="absolute w-10 h-10 rounded-full bg-primary animate-float" style={{ top: '30%', left: '80%', animationDelay: '2s' }} />
          <div className="absolute w-6 h-6 rounded-full bg-accent-blue animate-float" style={{ top: '70%', left: '70%', animationDelay: '1.5s' }} />
        </div>
      </div>
      
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
          100% {
            transform: translateY(0);
          }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
