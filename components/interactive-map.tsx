"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

interface InteractiveMapProps {
  address: string
  latitude: number
  longitude: number
}

const InteractiveMap = ({ address, latitude, longitude }: InteractiveMapProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Crear escena
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0a0a0f)

    // Crear cámara
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000,
    )
    camera.position.z = 5

    // Crear renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    containerRef.current.appendChild(renderer.domElement)

    // Añadir controles
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05

    // Crear plano base (mapa)
    const mapGeometry = new THREE.PlaneGeometry(10, 10)
    const mapMaterial = new THREE.MeshBasicMaterial({
      color: 0x141420,
      wireframe: true,
      transparent: true,
      opacity: 0.6,
    })
    const map = new THREE.Mesh(mapGeometry, mapMaterial)
    scene.add(map)

    // Crear grid para simular calles
    const gridHelper = new THREE.GridHelper(10, 20, 0xff0040, 0x303030)
    gridHelper.rotation.x = Math.PI / 2
    scene.add(gridHelper)

    // Crear marcador para la ubicación
    const markerGeometry = new THREE.CylinderGeometry(0, 0.2, 0.5, 4)
    const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0040 })
    const marker = new THREE.Mesh(markerGeometry, markerMaterial)
    marker.position.set(0, 0, 0.25)
    marker.rotation.x = Math.PI / 2
    scene.add(marker)

    // Añadir luz ambiental
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    // Añadir luz direccional
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(1, 1, 1)
    scene.add(directionalLight)

    // Añadir partículas para efecto cyberpunk
    const particlesGeometry = new THREE.BufferGeometry()
    const particlesCount = 500
    const posArray = new Float32Array(particlesCount * 3)

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10
    }

    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3))

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      color: 0x00ffbb,
      transparent: true,
      opacity: 0.8,
    })

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particlesMesh)

    // Función de animación
    const animate = () => {
      requestAnimationFrame(animate)

      // Rotar partículas lentamente
      particlesMesh.rotation.y += 0.001

      // Hacer que el marcador "flote"
      marker.position.z = 0.25 + Math.sin(Date.now() * 0.001) * 0.1

      controls.update()
      renderer.render(scene, camera)
    }

    animate()

    // Manejar redimensionamiento
    const handleResize = () => {
      if (!containerRef.current) return

      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    }

    window.addEventListener("resize", handleResize)

    // Limpieza
    return () => {
      window.removeEventListener("resize", handleResize)
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <div className="absolute bottom-2 left-2 z-10 bg-primary/80 backdrop-blur-sm p-2 rounded text-xs border border-accent-neon/30">
        <p className="text-accent-neon font-bold">{address}</p>
        <p className="text-text-secondary text-[10px]">
          Lat: {latitude.toFixed(6)} | Lng: {longitude.toFixed(6)}
        </p>
      </div>
    </div>
  )
}

export default InteractiveMap
