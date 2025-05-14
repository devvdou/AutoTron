"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useAnimation } from "framer-motion"

interface ParticleType {
  x: number
  y: number
  size: number
  vx: number
  vy: number
  color: string
  opacity: number
  blurAmount: number
  lifespan: number
  currentLife: number
}

interface ParticlesProps {
  className?: string
  quantity?: number
  colorPalette?: string[]
  stationary?: boolean
  interactive?: boolean
  particleType?: "neon" | "dust" | "stars" | "cyber" | "mixed"
  maxSize?: number
  minSize?: number
  speed?: number
  fadeEffect?: boolean
  blurEffect?: boolean
  glowEffect?: boolean
  trailEffect?: boolean
  mouseRepel?: boolean
  mouseAttract?: boolean
  density?: number
}

/**
 * Enhanced Particles component with multiple effects and interaction options
 *
 * @param className - Additional CSS classes
 * @param quantity - Number of particles to render
 * @param colorPalette - Array of colors for particles
 * @param stationary - If true, particles won't move
 * @param interactive - If true, particles will react to mouse movement
 * @param particleType - Type of particles to render
 * @param maxSize - Maximum particle size
 * @param minSize - Minimum particle size
 * @param speed - Movement speed multiplier
 * @param fadeEffect - If true, particles will fade in/out
 * @param blurEffect - If true, particles will have blur effect
 * @param glowEffect - If true, particles will have glow effect
 * @param trailEffect - If true, particles will leave trails
 * @param mouseRepel - If true, particles will be repelled by mouse
 * @param mouseAttract - If true, particles will be attracted to mouse
 * @param density - Density of particles (affects performance)
 */
const Particles = ({
  className = "",
  quantity = 50,
  colorPalette = ["#FF0040", "#00FFBB", "#4D00FF", "#FFFFFF"],
  stationary = false,
  interactive = true,
  particleType = "neon",
  maxSize = 3,
  minSize = 1,
  speed = 1,
  fadeEffect = true,
  blurEffect = true,
  glowEffect = true,
  trailEffect = false,
  mouseRepel = false,
  mouseAttract = false,
  density = 1,
}: ParticlesProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<ParticleType[]>([])
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const trailsRef = useRef<HTMLCanvasElement | null>(null)
  const trailsCtxRef = useRef<CanvasRenderingContext2D | null>(null)
  const controls = useAnimation()
  const [isInitialized, setIsInitialized] = useState(false)
  const rafRef = useRef<number | null>(null)

  // Adjust quantity based on density and screen size
  const adjustedQuantity = Math.floor(quantity * density)

  // Get particle color based on type
  const getParticleColor = () => {
    switch (particleType) {
      case "neon":
        return colorPalette[Math.floor(Math.random() * 2)] // First two colors
      case "dust":
        return "#FFFFFF"
      case "stars":
        return "#FFFFFF"
      case "cyber":
        return colorPalette[Math.floor(Math.random() * colorPalette.length)]
      case "mixed":
      default:
        return colorPalette[Math.floor(Math.random() * colorPalette.length)]
    }
  }

  // Get particle size based on type
  const getParticleSize = () => {
    switch (particleType) {
      case "neon":
        return Math.random() * (maxSize - minSize) + minSize
      case "dust":
        return Math.random() * 1.5 + 0.5
      case "stars":
        // Mostly small with a few larger ones
        return Math.random() < 0.9 ? Math.random() * 1 + 0.5 : Math.random() * 3 + 2
      case "cyber":
        return Math.random() * (maxSize - minSize) + minSize
      case "mixed":
      default:
        return Math.random() * (maxSize - minSize) + minSize
    }
  }

  // Get particle opacity based on type
  const getParticleOpacity = () => {
    switch (particleType) {
      case "neon":
        return Math.random() * 0.5 + 0.5
      case "dust":
        return Math.random() * 0.3 + 0.1
      case "stars":
        return Math.random() * 0.7 + 0.3
      case "cyber":
        return Math.random() * 0.8 + 0.2
      case "mixed":
      default:
        return Math.random() * 0.7 + 0.3
    }
  }

  // Get particle blur amount based on type
  const getParticleBlur = () => {
    if (!blurEffect) return 0

    switch (particleType) {
      case "neon":
        return Math.random() * 3 + 1
      case "dust":
        return Math.random() * 1 + 0.5
      case "stars":
        return Math.random() < 0.8 ? 0 : Math.random() * 2 + 1
      case "cyber":
        return Math.random() * 2 + 0.5
      case "mixed":
      default:
        return Math.random() * 2 + 0.5
    }
  }

  // Get particle velocity based on type
  const getParticleVelocity = () => {
    const baseVelocity = (Math.random() - 0.5) * 0.5 * speed

    switch (particleType) {
      case "neon":
        return baseVelocity * 1.2
      case "dust":
        return baseVelocity * 0.5
      case "stars":
        return baseVelocity * 0.3
      case "cyber":
        return baseVelocity * 1.5
      case "mixed":
      default:
        return baseVelocity
    }
  }

  // Get particle lifespan based on type
  const getParticleLifespan = () => {
    if (!fadeEffect) return Number.POSITIVE_INFINITY

    switch (particleType) {
      case "neon":
        return Math.random() * 200 + 100
      case "dust":
        return Math.random() * 300 + 200
      case "stars":
        return Number.POSITIVE_INFINITY // Stars don't fade
      case "cyber":
        return Math.random() * 150 + 50
      case "mixed":
      default:
        return Math.random() * 200 + 100
    }
  }

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const { width, height } = container.getBoundingClientRect()

    // Initialize trails canvas if trail effect is enabled
    if (trailEffect) {
      const canvas = document.createElement("canvas")
      canvas.width = width
      canvas.height = height
      canvas.style.position = "absolute"
      canvas.style.top = "0"
      canvas.style.left = "0"
      canvas.style.pointerEvents = "none"
      canvas.style.zIndex = "0"
      container.appendChild(canvas)

      trailsRef.current = canvas
      trailsCtxRef.current = canvas.getContext("2d")

      if (trailsCtxRef.current) {
        trailsCtxRef.current.fillStyle = "rgba(10, 10, 15, 0.05)"
        trailsCtxRef.current.fillRect(0, 0, width, height)
      }
    }

    // Generate particles
    particlesRef.current = Array.from({ length: adjustedQuantity }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: getParticleSize(),
      vx: getParticleVelocity(),
      vy: getParticleVelocity(),
      color: getParticleColor(),
      opacity: getParticleOpacity(),
      blurAmount: getParticleBlur(),
      lifespan: getParticleLifespan(),
      currentLife: 0,
    }))

    setIsInitialized(true)

    // Mouse move handler for interactive particles
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }

    if (interactive) {
      window.addEventListener("mousemove", handleMouseMove)
    }

    // Handle window resize
    const handleResize = () => {
      const { width, height } = container.getBoundingClientRect()

      // Resize trails canvas if it exists
      if (trailsRef.current) {
        trailsRef.current.width = width
        trailsRef.current.height = height

        if (trailsCtxRef.current) {
          trailsCtxRef.current.fillStyle = "rgba(10, 10, 15, 0.05)"
          trailsCtxRef.current.fillRect(0, 0, width, height)
        }
      }

      // Adjust particle positions to fit new container size
      particlesRef.current = particlesRef.current.map((particle) => ({
        ...particle,
        x: Math.min(particle.x, width),
        y: Math.min(particle.y, height),
      }))
    }

    window.addEventListener("resize", handleResize)

    return () => {
      if (interactive) {
        window.removeEventListener("mousemove", handleMouseMove)
      }
      window.removeEventListener("resize", handleResize)

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }

      // Remove trails canvas if it exists
      if (trailsRef.current && container.contains(trailsRef.current)) {
        container.removeChild(trailsRef.current)
      }
    }
  }, [
    adjustedQuantity,
    interactive,
    particleType,
    maxSize,
    minSize,
    speed,
    blurEffect,
    fadeEffect,
    trailEffect,
    colorPalette,
    density,
  ])

  useEffect(() => {
    if (!isInitialized || !containerRef.current) return

    const container = containerRef.current
    const { width, height } = container.getBoundingClientRect()

    if (!stationary) {
      const animateParticles = () => {
        if (!containerRef.current) return

        const { width, height } = containerRef.current.getBoundingClientRect()

        // Draw trails if enabled
        if (trailEffect && trailsCtxRef.current) {
          // Fade existing trails
          trailsCtxRef.current.fillStyle = "rgba(10, 10, 15, 0.05)"
          trailsCtxRef.current.fillRect(0, 0, width, height)
        }

        particlesRef.current = particlesRef.current.map((particle) => {
          let { x, y, vx, vy, size, color, opacity, blurAmount, lifespan, currentLife } = particle

          // Update lifespan
          currentLife += 1

          // Calculate opacity based on lifespan
          if (fadeEffect && lifespan !== Number.POSITIVE_INFINITY) {
            const halfLife = lifespan / 2
            if (currentLife < halfLife) {
              opacity = (currentLife / halfLife) * particle.opacity
            } else {
              opacity = ((lifespan - currentLife) / halfLife) * particle.opacity
            }
          }

          // Respawn particle if it's reached the end of its life
          if (currentLife >= lifespan) {
            return {
              x: Math.random() * width,
              y: Math.random() * height,
              size: getParticleSize(),
              vx: getParticleVelocity(),
              vy: getParticleVelocity(),
              color: getParticleColor(),
              opacity: getParticleOpacity(),
              blurAmount: getParticleBlur(),
              lifespan: getParticleLifespan(),
              currentLife: 0,
            }
          }

          // Mouse interaction
          if (interactive && (mouseRepel || mouseAttract)) {
            const dx = x - mouseRef.current.x
            const dy = y - mouseRef.current.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < 100) {
              const force = (0.5 * (100 - distance)) / 100
              const angle = Math.atan2(dy, dx)

              if (mouseRepel) {
                vx += Math.cos(angle) * force
                vy += Math.sin(angle) * force
              } else if (mouseAttract) {
                vx -= Math.cos(angle) * force
                vy -= Math.sin(angle) * force
              }
            }
          }

          // Update position
          x += vx
          y += vy

          // Draw trail if enabled
          if (trailEffect && trailsCtxRef.current) {
            trailsCtxRef.current.beginPath()
            trailsCtxRef.current.arc(x, y, size / 2, 0, Math.PI * 2)
            trailsCtxRef.current.fillStyle = color.replace(")", `, ${opacity * 0.3})`)
            trailsCtxRef.current.fill()
          }

          // Bounce off edges with some damping
          if (x < 0 || x > width) {
            vx = -vx * 0.8
            x = x < 0 ? 0 : width
          }

          if (y < 0 || y > height) {
            vy = -vy * 0.8
            y = y < 0 ? 0 : height
          }

          // Apply some gravity for dust particles
          if (particleType === "dust") {
            vy += 0.01 * speed
          }

          // Apply some random movement for cyber particles
          if (particleType === "cyber" && Math.random() < 0.05) {
            vx += (Math.random() - 0.5) * 0.2 * speed
            vy += (Math.random() - 0.5) * 0.2 * speed
          }

          // Limit velocity
          const maxVel = 2 * speed
          const vel = Math.sqrt(vx * vx + vy * vy)
          if (vel > maxVel) {
            vx = (vx / vel) * maxVel
            vy = (vy / vel) * maxVel
          }

          return { x, y, vx, vy, size, color, opacity, blurAmount, lifespan, currentLife }
        })

        controls.start((i) => {
          const particle = particlesRef.current[i]
          if (!particle) return {}

          return {
            x: particle.x,
            y: particle.y,
            opacity: particle.opacity,
            transition: { duration: 0.1, ease: "linear" },
          }
        })

        rafRef.current = requestAnimationFrame(animateParticles)
      }

      rafRef.current = requestAnimationFrame(animateParticles)
      return () => {
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current)
        }
      }
    }
  }, [
    isInitialized,
    stationary,
    controls,
    interactive,
    particleType,
    speed,
    fadeEffect,
    trailEffect,
    mouseRepel,
    mouseAttract,
  ])

  return (
    <div ref={containerRef} className={`${className} absolute inset-0 overflow-hidden`}>
      {isInitialized &&
        Array.from({ length: adjustedQuantity }).map((_, i) => {
          const particle = particlesRef.current[i]
          if (!particle) return null

          // Determine shadow based on particle type and glow effect
          let boxShadow = "none"
          if (glowEffect) {
            switch (particleType) {
              case "neon":
                boxShadow = `0 0 ${particle.size * 2}px ${particle.color}`
                break
              case "stars":
                boxShadow = Math.random() < 0.3 ? `0 0 ${particle.size * 3}px ${particle.color}` : "none"
                break
              case "cyber":
                boxShadow = `0 0 ${particle.size * 1.5}px ${particle.color}`
                break
              default:
                boxShadow = particle.size > maxSize / 2 ? `0 0 ${particle.size}px ${particle.color}` : "none"
            }
          }

          return (
            <motion.div
              key={i}
              custom={i}
              animate={controls}
              initial={{
                x: particle.x,
                y: particle.y,
                opacity: particle.opacity,
              }}
              className="absolute rounded-full"
              style={{
                backgroundColor: particle.color,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                boxShadow,
                filter: particle.blurAmount > 0 ? `blur(${particle.blurAmount}px)` : "none",
              }}
            />
          )
        })}
    </div>
  )
}

export default Particles
