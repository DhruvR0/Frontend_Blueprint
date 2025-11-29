"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { KeyboardEvent, PointerEvent } from "react";
import { Project } from "@/utils/data";

interface ProjectCardProps {
  project: Project;
  activeSlug: string | null;
  onSelect: (slug: string | null) => void;
  noAspect?: boolean;
}

const cardVariants = {
  hidden: { opacity: 0, y: 36, scale: 0.995 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function ProjectCard({ project, activeSlug, onSelect, noAspect }: ProjectCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const isDimmed = Boolean(activeSlug && activeSlug !== project.slug);
  const cardLayoutId = prefersReducedMotion ? undefined : `project-card-${project.slug}`;
  const mediaLayoutId = prefersReducedMotion ? undefined : `project-media-${project.slug}`;
  const overlayLayoutId = prefersReducedMotion ? undefined : `project-overlay-${project.slug}`;
  const titleLayoutId = prefersReducedMotion ? undefined : `project-title-${project.slug}`;

  const hoverMotion = prefersReducedMotion
    ? undefined
    : {
        scale: 1.03,
        y: -3,
        transition: { duration: 0.18, ease: "easeOut" },
      };

  const imageHoverMotion = prefersReducedMotion
    ? undefined
    : {
        scale: 1.06,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
      };

  const handleSelect = () => onSelect(project.slug);

  const handlePointerDown = (event: PointerEvent<HTMLAnchorElement>) => {
    if (event.button !== 0) return;
    handleSelect();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLAnchorElement>) => {
    if (event.key === " " || event.key === "Spacebar") {
      event.preventDefault();
      onSelect(project.slug);
    }
    if (event.key === "Enter") {
      onSelect(project.slug);
    }
  };

  return (
    <motion.article
      variants={cardVariants}
      animate={{
        opacity: isDimmed ? 0.3 : 1,
        scale: isDimmed ? 0.98 : 1,
        transition: { duration: 0.25, ease: "easeOut" },
      }}
      className={`group ${noAspect ? 'h-full flex flex-col' : ''}`}
    >
      <div className={noAspect ? 'h-full flex flex-col' : ''}>
        <Link href={`/projects/${project.slug}`} prefetch legacyBehavior>
          <motion.a
            layoutId={cardLayoutId}
            className={`block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black ${noAspect ? 'h-full flex flex-col' : ''}`}
            whileHover={hoverMotion}
            whileFocus={hoverMotion}
            onPointerDown={handlePointerDown}
            onKeyDown={handleKeyDown}
          >
            <div className={`relative overflow-hidden ${noAspect ? 'h-full flex-1' : 'aspect-[4/3]'} bg-gray-200 rounded-lg will-change-transform`}>
            <motion.div
              layoutId={mediaLayoutId}
              className="relative w-full h-full"
              whileHover={imageHoverMotion}
            >
              <Image
                src={project.coverImage}
                alt={project.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </motion.div>
            <motion.div
              layoutId={overlayLayoutId}
              className="absolute inset-0 bg-black/0"
              animate={{
                backgroundColor: isDimmed ? "rgba(0,0,0,0.25)" : "rgba(0,0,0,0)",
                transition: { duration: 0.25, ease: "easeOut" },
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 group-focus-within:translate-y-0 transition-transform duration-300 ease-out">
              <motion.h3
                layoutId={titleLayoutId}
                className="text-white text-xl font-bold"
              >
                {project.title}
              </motion.h3>
            </div>
          </div>
          <div className="mt-4 md:hidden">
            <h3 className="text-xl font-bold">{project.title}</h3>
          </div>
        </motion.a>
      </Link>
      </div>
    </motion.article>
  );
}

