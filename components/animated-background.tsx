"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion"

interface AnimatedBackgroundProps {
  children?: React.ReactNode
  intensity?: "low" | "medium" | "high"
  type?: "fluid" | "nebula" | "particles" | "cyber"
  primaryColor?: string
  secondaryColor?: string
  accentColor?: string
  interactive?: boolean
}

/**
 * AnimatedBackground Component
 *
 * Creates a seamless animated background with fluid particle motion
 * that complements the site's aesthetic without being distracting.
 */
const AnimatedBackground = ({
  children,
  intensity = "medium",
  type = "fluid",
  primaryColor = "#FF0040",
  secondaryColor = "#00FFBB",
  accentColor = "#4D00FF",
  interactive = true,
}: AnimatedBackgroundProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [isInitialized, setIsInitialized] = useState(false)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const { scrollY } = useScroll()
  const rafRef = useRef<number | null>(null)
  const isReducedMotion = useRef(false)

  // Parallax effect for background elements
  const y1 = useTransform(scrollY, [0, 1000], [0, 150])
  const y2 = useTransform(scrollY, [0, 1000], [0, -100])
  const y3 = useTransform(scrollY, [0, 1000], [0, 75])

  // Spring physics for smoother motion
  const springConfig = { damping: 50, stiffness: 100, mass: 0.5 }
  const springY1 = useSpring(y1, springConfig)
  const springY2 = useSpring(y2, springConfig)
  const springY3 = useSpring(y3, springConfig)

  // Mouse interaction
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !containerRef.current) return

    const { clientX, clientY } = e
    const { left, top, width, height } = containerRef.current.getBoundingClientRect()

    // Normalize mouse position to -1 to 1 range
    const normalizedX = ((clientX - left) / width - 0.5) * 2
    const normalizedY = ((clientY - top) / height - 0.5) * 2

    mouseX.set(normalizedX * 10) // Adjust sensitivity
    mouseY.set(normalizedY * 10)
  }

  // Initialize and animate the background
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return

    // Check for reduced motion preference
    if (typeof window !== "undefined" && window.matchMedia) {
      isReducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    }

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Initial dimensions setup
    const getContainerDimensions = () => {
      if (!containerRef.current) return { width: 0, height: 0 }
      const { width, height } = containerRef.current.getBoundingClientRect()
      return { width, height }
    }

    // Set canvas dimensions without updating state in a loop
    const updateCanvasDimensions = () => {
      if (!containerRef.current || !ctx) return

      const { width, height } = getContainerDimensions()
      canvas.width = width * window.devicePixelRatio
      canvas.height = height * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

      // Only update state if dimensions actually changed
      if (width !== dimensions.width || height !== dimensions.height) {
        setDimensions({ width, height })
      }
    }

    // Initial setup
    updateCanvasDimensions()

    // Set initialized flag
    if (!isInitialized) {
      setIsInitialized(true)
    }

    // Add resize listener
    window.addEventListener("resize", updateCanvasDimensions)

    // Determine particle count based on intensity and device
    const isMobile = window.innerWidth < 768
    const baseParticleCount = isMobile
      ? intensity === "low"
        ? 30
        : intensity === "medium"
          ? 50
          : 80
      : intensity === "low"
        ? 50
        : intensity === "medium"
          ? 100
          : 200

    // Adjust for reduced motion preference
    const particleCount = isReducedMotion.current ? Math.floor(baseParticleCount * 0.5) : baseParticleCount
    const animationSpeed = isReducedMotion.current ? 0.3 : intensity === "low" ? 0.5 : intensity === "medium" ? 1 : 1.5

    // Parse colors to RGB for canvas
    const parseColor = (color: string) => {
      const hex = color.replace("#", "")
      return {
        r: Number.parseInt(hex.substring(0, 2), 16),
        g: Number.parseInt(hex.substring(2, 4), 16),
        b: Number.parseInt(hex.substring(4, 6), 16),
      }
    }

    const primary = parseColor(primaryColor)
    const secondary = parseColor(secondaryColor)
    const accent = parseColor(accentColor)

    // Get current dimensions for animation
    const { width, height } = getContainerDimensions()

    // Noise function for more organic movement
    // Simplified Perlin noise implementation
    const noise = (() => {
      const permutation: number[] = []
      for (let i = 0; i < 256; i++) {
        permutation[i] = Math.floor(Math.random() * 256)
      }

      // Extend with a copy of the array
      for (let i = 0; i < 256; i++) {
        permutation[i + 256] = permutation[i]
      }

      const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10)

      const lerp = (t: number, a: number, b: number) => a + t * (b - a)

      const grad = (hash: number, x: number, y: number, z: number) => {
        const h = hash & 15
        const u = h < 8 ? x : y
        const v = h < 4 ? y : h === 12 || h === 14 ? x : z
        return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v)
      }

      return (x: number, y: number, z: number) => {
        const X = Math.floor(x) & 255
        const Y = Math.floor(y) & 255
        const Z = Math.floor(z) & 255

        x -= Math.floor(x)
        y -= Math.floor(y)
        z -= Math.floor(z)

        const u = fade(x)
        const v = fade(y)
        const w = fade(z)

        const A = permutation[X] + Y
        const AA = permutation[A] + Z
        const AB = permutation[A + 1] + Z
        const B = permutation[X + 1] + Y
        const BA = permutation[B] + Z
        const BB = permutation[B + 1] + Z

        return lerp(
          w,
          lerp(
            v,
            lerp(u, grad(permutation[AA], x, y, z), grad(permutation[BA], x - 1, y, z)),
            lerp(u, grad(permutation[AB], x, y - 1, z), grad(permutation[BB], x - 1, y - 1, z)),
          ),
          lerp(
            v,
            lerp(u, grad(permutation[AA + 1], x, y, z - 1), grad(permutation[BA + 1], x - 1, y, z - 1)),
            lerp(u, grad(permutation[AB + 1], x, y - 1, z - 1), grad(permutation[BB + 1], x - 1, y - 1, z - 1)),
          ),
        )
      }
    })()

    // Create fluid particles
    const particles: any[] = []
    for (let i = 0; i < particleCount; i++) {
      const size = Math.random() * 2 + 0.5
      const opacity = Math.random() * 0.5 + 0.2

      // Determine color based on type and position
      let color
      if (type === "fluid") {
        // Gradient-like color distribution
        const colorRatio = Math.random()
        if (colorRatio < 0.33) {
          color = primary
        } else if (colorRatio < 0.66) {
          color = secondary
        } else {
          color = accent
        }
      } else {
        // Default color assignment
        color = i % 3 === 0 ? primary : i % 3 === 1 ? secondary : accent
      }

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size,
        // Initial velocity is very small
        vx: (Math.random() - 0.5) * 0.2 * animationSpeed,
        vy: (Math.random() - 0.5) * 0.2 * animationSpeed,
        color,
        opacity,
        // For fluid motion
        noiseOffsetX: Math.random() * 1000,
        noiseOffsetY: Math.random() * 1000,
        // For trails
        trail: type === "fluid" || type === "cyber",
        trailLength: Math.floor(Math.random() * 5) + 3,
        trailPositions: [],
        // For pulsing
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulsePhase: Math.random() * Math.PI * 2,
      })
    }

    // Animation loop
    let time = 0
    const timeStep = isReducedMotion.current ? 0.005 : 0.01

    const animate = () => {
      // Get current dimensions in case they've changed
      const currentDimensions = getContainerDimensions()
      time += timeStep

      // Clear canvas
      ctx.clearRect(0, 0, currentDimensions.width, currentDimensions.height)

      // Draw gradient background
      const gradient = ctx.createRadialGradient(
        currentDimensions.width / 2,
        currentDimensions.height / 2,
        0,
        currentDimensions.width / 2,
        currentDimensions.height / 2,
        currentDimensions.width,
      )
      gradient.addColorStop(0, `rgba(15, 15, 25, 1)`)
      gradient.addColorStop(0.5, `rgba(10, 10, 20, 1)`)
      gradient.addColorStop(1, `rgba(5, 5, 15, 1)`)

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, currentDimensions.width, currentDimensions.height)

      // Update and draw particles
      particles.forEach((particle) => {
        // Calculate noise influence for fluid motion
        const noiseValue =
          noise(particle.noiseOffsetX + time * 0.1, particle.noiseOffsetY + time * 0.1, time * 0.1) * 2 - 1

        const noiseAngle = noiseValue * Math.PI * 2
        const noiseStrength = 0.3 * animationSpeed

        // Apply noise-based velocity changes for fluid motion
        particle.vx += Math.cos(noiseAngle) * noiseStrength
        particle.vy += Math.sin(noiseAngle) * noiseStrength

        // Apply damping for stability
        particle.vx *= 0.95
        particle.vy *= 0.95

        // Limit max velocity
        const maxVel = 1.5 * animationSpeed
        const vel = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy)
        if (vel > maxVel) {
          particle.vx = (particle.vx / vel) * maxVel
          particle.vy = (particle.vy / vel) * maxVel
        }

        // Update position
        particle.x += particle.vx
        particle.y += particle.vy

        // Store position for trail
        if (particle.trail) {
          particle.trailPositions.unshift({ x: particle.x, y: particle.y })
          if (particle.trailPositions.length > particle.trailLength) {
            particle.trailPositions.pop()
          }
        }

        // Wrap around edges with smooth transition
        if (particle.x < -50) particle.x = currentDimensions.width + 50
        if (particle.x > currentDimensions.width + 50) particle.x = -50
        if (particle.y < -50) particle.y = currentDimensions.height + 50
        if (particle.y > currentDimensions.height + 50) particle.y = -50

        // Calculate pulse for size and opacity variation
        const pulse = Math.sin(time * particle.pulseSpeed * 5 + particle.pulsePhase) * 0.5 + 0.5
        const currentSize = particle.size * (0.8 + pulse * 0.4)
        const currentOpacity = particle.opacity * (0.8 + pulse * 0.4)

        // Draw trail if enabled
        if (particle.trail && particle.trailPositions.length > 1) {
          ctx.beginPath()
          ctx.moveTo(particle.trailPositions[0].x, particle.trailPositions[0].y)

          for (let i = 1; i < particle.trailPositions.length; i++) {
            ctx.lineTo(particle.trailPositions[i].x, particle.trailPositions[i].y)
          }

          ctx.strokeStyle = `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${currentOpacity * 0.3})`
          ctx.lineWidth = currentSize * 0.5
          ctx.stroke()
        }

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, currentSize, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${currentOpacity})`
        ctx.fill()

        // Add glow effect
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, currentSize * 3, 0, Math.PI * 2)
        const glowGradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          currentSize * 0.5,
          particle.x,
          particle.y,
          currentSize * 3,
        )
        glowGradient.addColorStop(
          0,
          `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${currentOpacity * 0.4})`,
        )
        glowGradient.addColorStop(1, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, 0)`)
        ctx.fillStyle = glowGradient
        ctx.fill()
      })

      // Add subtle vignette effect
      const vignetteGradient = ctx.createRadialGradient(
        currentDimensions.width / 2,
        currentDimensions.height / 2,
        0,
        currentDimensions.width / 2,
        currentDimensions.height / 2,
        currentDimensions.width,
      )
      vignetteGradient.addColorStop(0, "rgba(0, 0, 0, 0)")
      vignetteGradient.addColorStop(0.7, "rgba(0, 0, 0, 0)")
      vignetteGradient.addColorStop(1, "rgba(0, 0, 0, 0.4)")

      ctx.fillStyle = vignetteGradient
      ctx.fillRect(0, 0, currentDimensions.width, currentDimensions.height)

      // Continue animation loop
      rafRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", updateCanvasDimensions)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [isInitialized, intensity, type, primaryColor, secondaryColor, accentColor])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full overflow-hidden z-[-1]"
      onMouseMove={handleMouseMove}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          width: "100%",
          height: "100%",
        }}
      />

      {/* Subtle parallax layers for depth */}
      <motion.div className="absolute inset-0 opacity-[0.02] z-0" style={{ y: springY1 }} />

      <motion.div className="absolute inset-0 opacity-[0.01] z-0" style={{ y: springY2 }} />

      {/* Noise texture overlay */}
      <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-overlay pointer-events-none"></div>

      {children}
    </div>
  )
}

export default AnimatedBackground
