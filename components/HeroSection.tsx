"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  backgroundImages?: string[];
  backgroundVideo?: string;
}

export default function HeroSection({
  title,
  subtitle,
  backgroundImage,
  backgroundImages,
  backgroundVideo,
}: HeroSectionProps) {
  // Use backgroundImages array if provided, otherwise use single backgroundImage
  const images = backgroundImages && backgroundImages.length > 0 
    ? backgroundImages 
    : backgroundImage 
      ? [backgroundImage] 
      : [];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2500); // Change every 2 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  const scrollToContent = () => {
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      {backgroundVideo ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={backgroundVideo} type="video/mp4" />
        </video>
      ) : (
        <div className="absolute inset-0 w-full h-full">
          {images.length > 0 && (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0 w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: images[currentImageIndex]
                    ? `url(${images[currentImageIndex]})`
                    : "linear-gradient(135deg, #000 0%, #333 100%)",
                }}
              />
            </AnimatePresence>
          )}
        </div>
      )}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto"
          >
            {subtitle}
          </motion.p>
        )}
      </div>

      {/* Scroll Indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        onClick={scrollToContent}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white hover:text-gray-300 transition-colors"
        aria-label="Scroll down"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown size={32} />
        </motion.div>
      </motion.button>
    </section>
  );
}

