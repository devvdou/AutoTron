"use client"

import type React from "react"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

interface SectionTransitionProps {
  children: React.ReactNode
  className?: string
  type?: "fade" | "slide" | "scale" | "none"
  direction?: "up" | "down" | "left" | "right"
  duration?: number
  delay?: number
  threshold?: number
  color?: string
}

/**
 * SectionTransition Component
 *
 * Creates a smooth transition between sections with various effects
 * to enhance the seamless background experience
 */
const SectionTransition = ({
  children,
  className = "",
  type = "fade",
  direction = "up",
  duration = 0.8,
  delay = 0,
  threshold = 0.2,
}: SectionTransitionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  // Transform values based on scroll position
  const opacity = useTransform(scrollYProgress, [0, threshold, threshold + 0.5, 1], [0, 1, 1, 1])

  // Different transform values based on direction
  const upTransform = useTransform(scrollYProgress, [0, threshold, 1], ["20px", "0px", "0px"])

  const downTransform = useTransform(scrollYProgress, [0, threshold, 1], ["-20px", "0px", "0px"])

  const leftTransform = useTransform(scrollYProgress, [0, threshold, 1], ["20px", "0px", "0px"])

  const rightTransform = useTransform(scrollYProgress, [0, threshold, 1], ["-20px", "0px", "0px"])

  const noneTransform = useTransform(scrollYProgress, [0, threshold, 1], ["0px", "0px", "0px"])

  const y = direction === "up" ? upTransform : direction === "down" ? downTransform : noneTransform

  const x = direction === "left" ? leftTransform : direction === "right" ? rightTransform : noneTransform

  const scaleTransform = useTransform(scrollYProgress, [0, threshold, 1], [0.95, 1, 1])
  const scale = type === "scale" ? scaleTransform : undefined

  // Render the section with appropriate transitions
  return (
    <div ref={sectionRef} className={`relative ${className}`}>
      {/* Eliminamos los bordes decorativos que causaban problemas */}
      <motion.div
        style={{
          opacity: type === "fade" || type === "scale" ? opacity : 1,
          y,
          x,
          scale,
        }}
        transition={{
          duration,
          delay,
          ease: [0.25, 0.1, 0.25, 1], // Cubic bezier for smooth motion
        }}
      >
        {children}
      </motion.div>
    </div>
  )
}

export default SectionTransition
