'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface FloatingIcon {
  id: number;
  src: string;
  alt: string;
  link: string;
  x: number;
  y: number;
  size: number;
  speed: number;
  direction: { x: number; y: number };
  rotation: number;
  rotationSpeed: number;
}

const iconConfig = [
  { src: '/images/sumple01.png', alt: 'キャラクター1', link: '/how-to-use' },
  { src: '/images/sumple02.png', alt: 'キャラクター2', link: '/how-to-use' },
  { src: '/images/sumple03.png', alt: 'キャラクター3', link: '/faq' },
  { src: '/images/sumple04.png', alt: 'キャラクター4', link: '/account/points/purchase' },
];

export default function AnimatedBackground() {
  const router = useRouter();
  const [icons, setIcons] = useState<FloatingIcon[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // 初期アイコンの生成（各キャラクターを3-4個ずつ配置）
    const initialIcons: FloatingIcon[] = [];
    let idCounter = 0;

    iconConfig.forEach((config, configIndex) => {
      const count = 3 + Math.floor(Math.random() * 2); // 3-4個
      
      for (let i = 0; i < count; i++) {
        initialIcons.push({
          id: idCounter++,
          src: config.src,
          alt: config.alt,
          link: config.link,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: 40 + Math.random() * 40, // 40-80px
          speed: 0.3 + Math.random() * 0.5, // 0.3-0.8 px/frame
          direction: {
            x: (Math.random() - 0.5) * 2,
            y: (Math.random() - 0.5) * 2
          },
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 2 // -1 to 1 degrees/frame
        });
      }
    });

    setIcons(initialIcons);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const animate = () => {
      setIcons(prevIcons => 
        prevIcons.map(icon => {
          let newX = icon.x + icon.direction.x * icon.speed;
          let newY = icon.y + icon.direction.y * icon.speed;
          let newDirectionX = icon.direction.x;
          let newDirectionY = icon.direction.y;

          // 画面端での反射
          if (newX <= 0 || newX >= window.innerWidth - icon.size) {
            newDirectionX = -newDirectionX;
            newX = Math.max(0, Math.min(window.innerWidth - icon.size, newX));
          }
          if (newY <= 0 || newY >= window.innerHeight - icon.size) {
            newDirectionY = -newDirectionY;
            newY = Math.max(0, Math.min(window.innerHeight - icon.size, newY));
          }

          return {
            ...icon,
            x: newX,
            y: newY,
            direction: { x: newDirectionX, y: newDirectionY },
            rotation: (icon.rotation + icon.rotationSpeed) % 360
          };
        })
      );
    };

    const intervalId = setInterval(animate, 16); // ~60fps

    return () => clearInterval(intervalId);
  }, [mounted]);

  const handleIconClick = (link: string, e: React.MouseEvent) => {
    e.preventDefault();
    router.push(link);
  };

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {icons.map(icon => (
        <div
          key={icon.id}
          className="absolute pointer-events-auto cursor-pointer hover:scale-110 transition-transform duration-200"
          style={{
            left: `${icon.x}px`,
            top: `${icon.y}px`,
            transform: `rotate(${icon.rotation}deg)`,
          }}
          onClick={(e) => handleIconClick(icon.link, e)}
        >
          <Image
            src={icon.src}
            alt={icon.alt}
            width={icon.size}
            height={icon.size}
            className="opacity-20 hover:opacity-40 transition-opacity duration-200"
            style={{
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
            }}
          />
        </div>
      ))}
    </div>
  );
}
