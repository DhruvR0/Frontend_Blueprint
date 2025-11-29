"use client";

import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/utils/data";

export default function ProjectsPage() {
  // Ensure we always have at least 7 cards for layout structure
  const filled = [...projects];
  while (filled.length < 7 && projects.length > 0) {
    filled.push({
      ...projects[0],
      id: "placeholder-" + filled.length, 
      title: "Coming Soon",
      slug: "coming-soon-" + filled.length,
    });
  }

  // Safety check: if no projects, show message
  if (filled.length === 0) {
    return (
      <div className="pt-20 bg-[#111] text-white min-h-screen flex items-center justify-center">
        <p className="text-xl">No projects found.</p>
      </div>
    );
  }

  return (
    <div className="pt-20 bg-[#111] text-white min-h-screen relative z-10">

      {/* GRID LAYOUT - Matching Reference Image */}
      <section className="px-4 sm:px-6 lg:px-10 py-10">
        <div className="max-w-[1800px] mx-auto">

          {/* ROW 1 - Three columns with vertical offset - Matching Reference */}
          {filled[0] && filled[1] && filled[2] && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 mb-8 md:mb-16">
              <div className="md:col-span-7 h-[400px] md:h-[520px] relative md:-mt-6">
                <ProjectCard project={filled[0]} activeSlug={null} onSelect={() => {}} noAspect />
                <div className="mt-3">
                  <h3 className="text-white text-lg font-semibold">{filled[0].title}</h3>
                  <p className="text-gray-400 text-sm">{filled[0].category}</p>
                </div>
              </div>
              <div className="md:col-span-3 h-[350px] md:h-[420px] relative md:mt-32">
                <ProjectCard project={filled[1]} activeSlug={null} onSelect={() => {}} noAspect />
                <div className="mt-3">
                  <h3 className="text-white text-lg font-semibold">{filled[1].title}</h3>
                  <p className="text-gray-400 text-sm">{filled[1].category}</p>
                </div>
              </div>
              <div className="md:col-span-2 h-[280px] md:h-[340px] relative md:mt-10">
                <ProjectCard project={filled[2]} activeSlug={null} onSelect={() => {}} noAspect />
                <div className="mt-3">
                  <h3 className="text-white text-lg font-semibold">{filled[2].title}</h3>
                  <p className="text-gray-400 text-sm">{filled[2].category}</p>
                </div>
              </div>
            </div>
          )}

          {/* ROW 2 - Two columns staggered */}
          {filled[3] && filled[4] && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8 md:mb-16">
              {/* Left card - MS WELLINGTON */}
              <div className="md:col-span-4 h-[380px] md:h-[480px] relative md:-mt-12">
                <ProjectCard project={filled[3]} activeSlug={null} onSelect={() => {}} noAspect />
                <div className="mt-3">
                  <h3 className="text-white text-lg font-semibold">{filled[3].title}</h3>
                  <p className="text-gray-400 text-sm">{filled[3].category}</p>
                </div>
              </div>
              <div className="md:col-span-8 h-[420px] md:h-[540px] relative md:mt-8">
                <ProjectCard project={filled[4]} activeSlug={null} onSelect={() => {}} noAspect />
                <div className="mt-3">
                  <h3 className="text-white text-lg font-semibold">{filled[4].title}</h3>
                  <p className="text-gray-400 text-sm">{filled[4].category}</p>
                </div>
              </div>
            </div>
          )}

          {/* ROW 3 - Two columns reverse staggered */}
          {filled[5] && filled[6] && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8 md:mb-16">
              <div className="md:col-span-7 h-[400px] md:h-[520px] relative md:mt-4">
                <ProjectCard project={filled[5]} activeSlug={null} onSelect={() => {}} noAspect />
                <div className="mt-3">
                  <h3 className="text-white text-lg font-semibold">{filled[5].title}</h3>
                  <p className="text-gray-400 text-sm">{filled[5].category}</p>
                </div>
              </div>
              <div className="md:col-span-5 h-[350px] md:h-[460px] relative md:-mt-8">
                <ProjectCard project={filled[6]} activeSlug={null} onSelect={() => {}} noAspect />
                <div className="mt-3">
                  <h3 className="text-white text-lg font-semibold">{filled[6].title}</h3>
                  <p className="text-gray-400 text-sm">{filled[6].category}</p>
                </div>
              </div>
            </div>
          )}

          {/* Additional rows if more projects exist */}
          {filled.slice(7).map((project, idx) => {
            const position = idx % 3;
            
            if (position === 0 && filled[7 + idx + 1] && filled[7 + idx + 2]) {
              // Repeat Row 1 pattern
              return (
                <div key={project.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8 md:mb-16">
                  <div className="md:col-span-5 h-[400px] md:h-[500px] relative md:-mt-8">
                    <ProjectCard project={filled[7 + idx]} activeSlug={null} onSelect={() => {}} noAspect />
                    <div className="mt-3">
                      <h3 className="text-white text-lg font-semibold">{filled[7 + idx].title}</h3>
                      <p className="text-gray-400 text-sm">{filled[7 + idx].category}</p>
                    </div>
                  </div>
                  <div className="md:col-span-4 h-[350px] md:h-[440px] relative md:mt-4">
                    <ProjectCard project={filled[7 + idx + 1]} activeSlug={null} onSelect={() => {}} noAspect />
                    <div className="mt-3">
                      <h3 className="text-white text-lg font-semibold">{filled[7 + idx + 1].title}</h3>
                      <p className="text-gray-400 text-sm">{filled[7 + idx + 1].category}</p>
                    </div>
                  </div>
                  <div className="md:col-span-3 h-[280px] md:h-[360px] relative md:mt-12">
                    <ProjectCard project={filled[7 + idx + 2]} activeSlug={null} onSelect={() => {}} noAspect />
                    <div className="mt-3">
                      <h3 className="text-white text-lg font-semibold">{filled[7 + idx + 2].title}</h3>
                      <p className="text-gray-400 text-sm">{filled[7 + idx + 2].category}</p>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          }).filter(Boolean)}

        </div>
      </section>
    </div>
  );
}