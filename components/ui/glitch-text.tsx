"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface GlitchTextProps {
  text: string
  className?: string
  intensity?: "low" | "medium" | "high"
}

export const GlitchText = ({ text, className = "", intensity = "medium" }: GlitchTextProps) => {
  const [isGlitching, setIsGlitching] = useState(false)

  // Set glitch intensity parameters
  const glitchInterval = intensity === "low" ? 5000 : intensity === "medium" ? 3000 : 1500
  const glitchDuration = intensity === "low" ? 1000 : intensity === "medium" ? 2000 : 3000

  useEffect(() => {
    // Start glitching at random intervals
    const intervalId = setInterval(
      () => {
        setIsGlitching(true)

        // Stop glitching after a duration
        setTimeout(() => {
          setIsGlitching(false)
        }, glitchDuration)
      },
      glitchInterval + Math.random() * 2000,
    ) // Add randomness to the interval

    return () => clearInterval(intervalId)
  }, [glitchDuration, glitchInterval])

  return (
    <span className={`inline-block relative ${className} ${isGlitching ? "glitch" : ""}`} data-text={text}>
      {isGlitching && (
        <>
          <motion.span
            className="absolute top-0 left-0 text-cyan-500 opacity-70"
            animate={{
              x: [0, -2, 0, 2, 0],
              opacity: [0.7, 0.5, 0.7],
            }}
            transition={{
              duration: 0.2,
              repeat: 5,
              repeatType: "reverse",
            }}
          >
            {text}
          </motion.span>
          <motion.span
            className="absolute top-0 left-0 text-fuchsia-500 opacity-70"
            animate={{
              x: [0, 2, 0, -2, 0],
              opacity: [0.7, 0.5, 0.7],
            }}
            transition={{
              duration: 0.3,
              repeat: 3,
              repeatType: "reverse",
            }}
          >
            {text}
          </motion.span>
        </>
      )}
      {text}
    </span>
  )
}
