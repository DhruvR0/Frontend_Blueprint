"use client";

import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import ProjectCard from "@/components/ProjectCard";
import { projects, Project } from "@/utils/data";

type Category = "All" | "Architecture" | "Interiors" | "Urban" | "Object";

const containerVariants = {
  hidden: {},
  visible: (prefersReducedMotion: boolean) => ({
    transition: prefersReducedMotion
      ? undefined
      : {
          staggerChildren: 0.14,
          delayChildren: 0.15,
        },
  }),
};

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!activeSlug) return;
    const timeout = window.setTimeout(() => setActiveSlug(null), 800);
    return () => window.clearTimeout(timeout);
  }, [activeSlug]);

  const categories: Category[] = ["All", "Architecture", "Interiors", "Urban", "Object"];

  const filteredProjects =
    selectedCategory === "All"
      ? projects
      : projects.filter((project) => project.category === selectedCategory);

  return (
    <div className="pt-20">


      {/* Filters */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white border-b sticky top-20 z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${
                  selectedCategory === category
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          {filteredProjects.length > 0 ? (
            <div className="space-y-6 md:space-y-8">
              {(() => {
                // Group projects into rows following pattern: 3, 2, 2, 3, 2, 2...
                const rows: Project[][] = [];
                let currentRow: Project[] = [];
                let rowIndex = 0;
                
                filteredProjects.forEach((project) => {
                  currentRow.push(project);
                  
                  // Determine row size based on pattern: row 0, 3, 6... = 3 cards, others = 2 cards
                  const shouldBeThreeCards = rowIndex % 3 === 0;
                  const rowSize = shouldBeThreeCards ? 3 : 2;
                  
                  if (currentRow.length === rowSize) {
                    rows.push(currentRow);
                    currentRow = [];
                    rowIndex++;
                  }
                });
                
                // Add remaining projects
                if (currentRow.length > 0) {
                  rows.push(currentRow);
                }
                
                return rows.map((row, idx) => {
                  const isThreeCardRow = row.length === 3;
                  
                  // For 3-card rows, use flex with vertical offsets for staggered effect
                  // For 2-card rows, use flex with vertical offsets to create staggered effect
                  if (isThreeCardRow) {
                    return (
                      <motion.div
                        key={idx}
                        layout
                        className="flex flex-col md:flex-row gap-4 md:gap-6 items-start"
                        variants={containerVariants}
                        initial={prefersReducedMotion ? undefined : "hidden"}
                        animate="visible"
                        custom={prefersReducedMotion}
                      >
                        {row.map((project, cardIdx) => {
                          // Add vertical offset: left card slightly up, middle stays, right card more down
                          let verticalOffset = "";
                          if (cardIdx === 0) {
                            verticalOffset = "-mt-6 md:-mt-10"; // Left card up
                          } else if (cardIdx === 1) {
                            verticalOffset = ""; // Middle card stays
                          } else {
                            verticalOffset = "mt-12 md:mt-16"; // Right card down more
                          }
                          
                          return (
                            <div
                              key={project.id}
                              className={`flex-1 ${verticalOffset} transition-all duration-300`}
                            >
                              <ProjectCard
                                project={project}
                                activeSlug={activeSlug}
                                onSelect={setActiveSlug}
                                isLarge={false}
                              />
                            </div>
                          );
                        })}
                      </motion.div>
                    );
                  } else {
                    // 2-card rows with vertical offsets
                    return (
                      <motion.div
                        key={idx}
                        layout
                        className="flex flex-col md:flex-row gap-4 md:gap-6 items-start"
                        variants={containerVariants}
                        initial={prefersReducedMotion ? undefined : "hidden"}
                        animate="visible"
                        custom={prefersReducedMotion}
                      >
                        {row.map((project, cardIdx) => {
                          // Add vertical offset: first card slightly up, second card slightly down
                          const verticalOffset = cardIdx === 0 ? "-mt-8 md:-mt-12" : "mt-8 md:mt-12";
                          
                          return (
                            <div
                              key={project.id}
                              className={`flex-1 ${verticalOffset} transition-all duration-300`}
                            >
                              <ProjectCard
                                project={project}
                                activeSlug={activeSlug}
                                onSelect={setActiveSlug}
                                isLarge={true}
                              />
                            </div>
                          );
                        })}
                      </motion.div>
                    );
                  }
                });
              })()}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No projects found in this category.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

