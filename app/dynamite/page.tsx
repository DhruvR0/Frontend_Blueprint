"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import FloatingWindow from "@/components/FloatingWindow";
import { dynamiteItems } from "@/utils/data";
import Image from "next/image";

export default function DynamitePage() {
  const scopeRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const [positions, setPositions] = useState<
    Record<string, { x: number; y: number }>
  >({});
  const [openIds, setOpenIds] = useState<string[]>([]);
  const [focusedId, setFocusedId] = useState<string | null>(null);

  const clamp = (x: number, y: number, width: number, height: number) => {
    if (!scopeRef.current || isMobile) return { x: 0, y: 0 };

    const rect = scopeRef.current.getBoundingClientRect();
    const margin = 20;

    const maxX = rect.width / 2 - width / 2 - margin;
    const maxY = rect.height / 2 - height / 2 - margin;

    return {
      x: Math.max(-maxX, Math.min(maxX, x)),
      y: Math.max(-maxY, Math.min(maxY, y)),
    };
  };

  // Screen sizing - only after mount to prevent hydration issues
  useEffect(() => {
    setIsMounted(true);
    const update = () =>
      setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Compute initial positions - only after mount
  useEffect(() => {
    if (!isMounted) return;

    const attempt = () => {
      if (!scopeRef.current) return false;
      const rect = scopeRef.current.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    };

    let tries = 0;
    const max = 20;

    const wait = () => {
      if (!attempt()) {
        tries++;
        if (tries < max) requestAnimationFrame(wait);
        return;
      }

      const newPositions = dynamiteItems.reduce((acc, item) => {
        const base = item.position ?? { x: 0, y: 0 };
        const width = item.dimensions?.width ?? 420;
        const height = item.dimensions?.height ?? 320;

        acc[item.id] = clamp(base.x, base.y - 80, width, height);
        return acc;
      }, {} as Record<string, { x: number; y: number }>);

      setPositions(newPositions);
    };

    wait();
  }, [isMobile, isMounted]);

  // Reveal windows one-by-one
  useEffect(() => {
    if (!positions || Object.keys(positions).length === 0) return;

    setOpenIds([]);
    let t: number[] = [];

    dynamiteItems.forEach((item, index) => {
      const timeout = window.setTimeout(() => {
        setOpenIds((prev) => [...prev, item.id]);
        setFocusedId(item.id);
      }, index * 520);

      t.push(timeout);
    });

    return () => t.forEach((x) => clearTimeout(x));
  }, [positions]);

  const handleFocus = (id: string) => {
    setFocusedId(id);
    setOpenIds((prev) => [...prev.filter((x) => x !== id), id]);
  };

  const handleClose = (id: string) => {
    setOpenIds((prev) => prev.filter((x) => x !== id));
  };

  return (
    <div className="relative min-h-screen h-screen text-white">
      {/* BACKGROUND */}
      <div className="absolute inset-0 -z-10 h-full w-full">
        <Image
          src="/images/urban-bistro-mississauga-dining-2.png"
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* CONTENT */}
      <div className="absolute inset-0 flex justify-start items-start">
        <div
          ref={scopeRef}
          className="relative w-full h-full"
          suppressHydrationWarning
        >
          {isMounted && (
            <AnimatePresence>
              {openIds.map((id) => {
                const item = dynamiteItems.find((x) => x.id === id);
                if (!item || !positions[item.id]) return null;

                return (
                  <FloatingWindow
                    key={item.id}
                    item={item}
                    zIndex={openIds.indexOf(item.id) + 20}
                    isFocused={focusedId === item.id}
                    onFocus={handleFocus}
                    onClose={handleClose}
                    dragScope={scopeRef}
                    initialPosition={positions[item.id]}
                    isMobile={isMobile}
                  />
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
