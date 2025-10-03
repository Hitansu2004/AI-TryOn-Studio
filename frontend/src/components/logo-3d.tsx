'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Logo3D() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!mounted) {
    return (
      <div className="relative flex items-center space-x-3 cursor-pointer select-none" suppressHydrationWarning>
        {/* Static logo content for SSR */}
        <div className="relative">
          <svg width="48" height="48" viewBox="0 0 48 48" className="drop-shadow-2xl">
            <defs>
              <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#8B5CF6', stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: '#06B6D4', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#10B981', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <path
              d="M16 8 L14 12 L12 16 L12 36 L36 36 L36 16 L34 12 L32 8 Z"
              fill="url(#logoGradient)"
              opacity="0.9"
            />
            <path
              d="M20 6 Q24 4 28 6 L30 8 L18 8 Z"
              fill="url(#logoGradient)"
            />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-500 via-cyan-500 to-emerald-500 bg-clip-text text-transparent">
            StyleSync
          </span>
          <span className="text-xs text-muted-foreground font-medium tracking-wider">
            AI FASHION
          </span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="relative flex items-center space-x-3 cursor-pointer select-none"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{
        transform: `perspective(1000px) rotateY(${mousePosition.x}deg) rotateX(${-mousePosition.y}deg)`,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* 3D Logo Icon */}
      <motion.div
        className="relative"
        animate={{
          rotateY: [0, 360],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          className="drop-shadow-2xl"
        >
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#8B5CF6', stopOpacity: 1 }} />
              <stop offset="50%" style={{ stopColor: '#06B6D4', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#10B981', stopOpacity: 1 }} />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Main Fashion Icon */}
          <motion.g
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {/* Dress silhouette */}
            <path
              d="M16 8 L14 12 L12 16 L12 36 L36 36 L36 16 L34 12 L32 8 Z"
              fill="url(#logoGradient)"
              filter="url(#glow)"
              opacity="0.9"
            />
            
            {/* Hanger */}
            <motion.path
              d="M20 6 Q24 4 28 6 L30 8 L18 8 Z"
              fill="url(#logoGradient)"
              animate={{
                y: [0, -2, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            
            {/* Sparkle effects */}
            <motion.circle
              cx="20"
              cy="20"
              r="2"
              fill="#ffffff"
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 0,
              }}
            />
            <motion.circle
              cx="28"
              cy="24"
              r="1.5"
              fill="#ffffff"
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 0.5,
              }}
            />
            <motion.circle
              cx="24"
              cy="30"
              r="1"
              fill="#ffffff"
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 1,
              }}
            />
          </motion.g>
        </svg>
      </motion.div>

      {/* Brand Text */}
      <div className="flex flex-col">
        <motion.span
          className="text-2xl font-bold bg-gradient-to-r from-purple-500 via-cyan-500 to-emerald-500 bg-clip-text text-transparent"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            backgroundSize: '200% 200%',
          }}
        >
          StyleSync
        </motion.span>
        <motion.span
          className="text-xs text-muted-foreground font-medium tracking-wider"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          AI FASHION
        </motion.span>
      </div>

      {/* Floating Elements */}
      <div className="absolute -top-2 -right-2">
        <motion.div
          className="w-3 h-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
          animate={{
            y: [0, -10, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
      
      <div className="absolute -bottom-2 -left-2">
        <motion.div
          className="w-2 h-2 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full"
          animate={{
            y: [0, 8, 0],
            rotate: [0, -180, -360],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>
    </motion.div>
  );
}
