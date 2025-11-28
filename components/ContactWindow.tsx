"use client";

import { useEffect, useState, FormEvent } from "react";
import { motion, useReducedMotion, useMotionValue } from "framer-motion";
import emailjs from "@emailjs/browser";

interface ContactWindowProps {
  id: string;
  title: string;
  content: string | string[];
  initialPosition: { x: number; y: number };
  onClose: (id: string) => void;
  onFocus: (id: string) => void;
  zIndex: number;
  dragScope: React.RefObject<HTMLDivElement>;
}

export default function ContactWindow({
  id,
  title,
  content,
  initialPosition,
  onClose,
  onFocus,
  zIndex,
  dragScope,
}: ContactWindowProps) {
  const prefersReducedMotion = useReducedMotion();
  const [isMounted, setIsMounted] = useState(false);
  const [dragConstraints, setDragConstraints] = useState({
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  });

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Calculate drag constraints based on container
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Set initial position after mount - x and y should start at 0 since we use left/top
  useEffect(() => {
    if (isMounted) {
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        x.set(0);
        y.set(0);
      });
    }
  }, [isMounted, x, y]);

  useEffect(() => {
    if (!isMounted || !dragScope.current || typeof window === "undefined") {
      return;
    }

    const calculateConstraints = () => {
      if (!dragScope.current) return { left: 0, right: 0, top: 0, bottom: 0 };

      const containerRect = dragScope.current.getBoundingClientRect();
      const windowWidth = 550; // Approximate window width
      const windowHeight = 400; // Approximate window height

      // Constraints relative to initial position
      const minX = 0 - initialPosition.x;
      const maxX = containerRect.width - windowWidth - initialPosition.x;
      const minY = 0 - initialPosition.y;
      const maxY = containerRect.height - windowHeight - initialPosition.y;

      return {
        left: minX,
        right: maxX,
        top: minY,
        bottom: maxY,
      };
    };

    const updateConstraints = () => {
      if (!dragScope.current) {
        requestAnimationFrame(updateConstraints);
        return;
      }
      setDragConstraints(calculateConstraints());
    };

    updateConstraints();

    const handleResize = () => {
      setDragConstraints(calculateConstraints());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMounted, dragScope, initialPosition, x, y]);

  const contentArray = Array.isArray(content) ? content : [content];

  const getTitleClasses = () => {
    const base =
      "font-bold uppercase text-white leading-none mb-4 transition-[font-size]";
    if (id === "email" || id === "phone") {
      return `text-[28px] md:text-[36px] lg:text-[44px] ${base}`;
    }
    return `text-[32px] md:text-[48px] lg:text-[64px] ${base}`;
  };

  const getBodyClasses = () => {
    const base = "text-white/85 leading-tight transition-[font-size]";
    if (id === "email" || id === "phone") {
      return `text-[14px] md:text-[16px] ${base}`;
    }
    return `text-[16px] md:text-[18px] ${base}`;
  };

  // Form state for address card
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "service_ac27qw7";
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "template_d4sl83b";
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "ZoWcaZVkUpQR-uXqF";

      await emailjs.send(
        serviceId,
        templateId,
        {
          name: formData.name,
          email: formData.email,
          phone: formData.mobile,
          message: formData.message,
        },
        publicKey
      );

      setSubmitStatus("success");
      setFormData({ name: "", mobile: "", email: "", message: "" });
      setTimeout(() => setSubmitStatus("idle"), 3000);
    } catch (error) {
      console.error("EmailJS error:", error);
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus("idle"), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      drag={isMounted && !prefersReducedMotion}
      dragConstraints={dragConstraints}
      dragElastic={0.05}
      dragMomentum={false}
      whileDrag={{ cursor: "grabbing" }}
      onPointerDown={() => onFocus(id)}
      style={{
        left: initialPosition.x,
        top: initialPosition.y,
        x,
        y,
        zIndex,
        position: "absolute",
      }}
      // Window width tweaks per card (address gets the larger form layout)
      className={`bg-black border-2 border-white overflow-hidden select-none cursor-move ${
        id === "address" ? "w-[500px]" : "w-[400px]"
      } max-w-[90vw]`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/20">
        <span className="text-[11px] uppercase tracking-[0.15em] text-white">
          CONTACT
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose(id);
          }}
          className="h-5 w-5 flex items-center justify-center text-white hover:text-white/70 transition-colors text-xl leading-none"
          aria-label={`Close ${title}`}
          onPointerDown={(e) => e.stopPropagation()}
        >
        </button>
      </div>

      {/* Content */}
      <div className="px-10 py-8 bg-black">
        {id === "address" ? (
          // Contact Form
          <form
            onSubmit={handleFormSubmit}
            className="grid gap-4 md:grid-cols-2"
          >
            <div className="md:col-span-1">
              <label
                htmlFor="name"
                className="block text-xs uppercase tracking-wider text-white/70 mb-2"
              >
                YOUR NAME*
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                required
                className="w-full px-4 py-2 bg-white/10 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:border-white/50 transition-colors"
                placeholder=""
              />
            </div>

            <div className="md:col-span-1">
              <label
                htmlFor="mobile"
                className="block text-xs uppercase tracking-wider text-white/70 mb-2"
              >
                YOUR MOBILE*
              </label>
              <input
                type="tel"
                id="mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleFormChange}
                required
                className="w-full px-4 py-2 bg-white/10 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:border-white/50 transition-colors"
                placeholder=""
              />
            </div>

            <div className="md:col-span-1">
              <label
                htmlFor="email"
                className="block text-xs uppercase tracking-wider text-white/70 mb-2"
              >
                EMAIL*
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                required
                className="w-full px-4 py-2 bg-white/10 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:border-white/50 transition-colors"
                placeholder=""
              />
            </div>

            <div className="md:col-span-1">
              <label
                htmlFor="message"
                className="block text-xs uppercase tracking-wider text-white/70 mb-2"
              >
                YOUR MESSAGE*
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleFormChange}
                required
                rows={4}
                className="w-full px-4 py-2 bg-white/10 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:border-white/50 transition-colors resize-y md:h-full"
                placeholder=""
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-900 hover:bg-blue-800 text-white uppercase tracking-wider py-3 px-6 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4 md:col-span-2"
            >
              {isSubmitting ? (
                "SENDING..."
              ) : (
                <>
                  SEND QUESTIONS <span className="text-lg">&gt;</span>
                </>
              )}
            </button>

            {submitStatus === "success" && (
              <p className="text-green-400 text-sm text-center mt-2">
                Message sent successfully!
              </p>
            )}
            {submitStatus === "error" && (
              <p className="text-red-400 text-sm text-center mt-2">
                Failed to send. Please try again.
              </p>
            )}
          </form>
        ) : (
          // Regular content
          <>
            {/* Email + phone cards get a tighter scale so they feel lighter */}
            <h2 className={getTitleClasses()}>
              {title}
            </h2>
            <div className="space-y-1">
              {contentArray.map((line, i) => (
                <p key={i} className={getBodyClasses()}>
                  {line}
                </p>
              ))}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

