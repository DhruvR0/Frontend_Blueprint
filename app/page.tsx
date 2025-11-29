"use client";

import HeroSection from "@/components/HeroSection";
import { projects } from "@/utils/data";

export default function Home() {
  // Get cover images from first few projects for rotation
  const backgroundImages = projects
    .slice(0, 5)
    .map((project) => project.coverImage)
    .filter(Boolean);

  return (
    <>
      {/* Hero Section */}
      <HeroSection
        title="Blueprint 3D Studio"
        subtitle="Making the improbable possible"
        backgroundImages={backgroundImages}
      />
    </>
  );
}

