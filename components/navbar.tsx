"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Facebook, Instagram, Twitter, User as UserIcon, LogIn, LogOut, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { COMPANY_DATA } from "@/lib/constants"
import { supabase } from "@/lib/supabase" // Import Supabase client
import UserService, { type User } from "@/lib/services/user-service" // Import UserService and User type
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    console.log("Navbar - NEXT_PUBLIC_SUPABASE_ANON_KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      setAuthLoading(true)
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setCurrentUser(null)
        setAuthLoading(false)
        return
      }
      const user = await UserService.getCurrentUser()
      setCurrentUser(user)
      setAuthLoading(false)
    }

    fetchUser()

    const { data: authListener, subscription } = supabase.auth.onAuthStateChange(async (event, session) => {
      setAuthLoading(true)
      if (!session) {
        setCurrentUser(null)
        setAuthLoading(false)
        return
      }
      const user = await UserService.getCurrentUser()
      setCurrentUser(user)
      setAuthLoading(false)
      if (event === "SIGNED_OUT") {
        // Optionally redirect or update UI further
      }
      if (event === "SIGNED_IN" && session?.user) {
        // Optionally fetch profile or redirect
      }
    })

    return () => {
      if (typeof authListener?.unsubscribe === "function") {
        authListener.unsubscribe()
      } else if (subscription && typeof subscription.unsubscribe === "function") {
        subscription.unsubscribe()
      }
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setCurrentUser(null)
    // router.push('/'); // Optionally redirect to home or login page
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-primary/90 backdrop-blur-md shadow-lg" : "bg-transparent",
      )}
    >
      <div className="container-custom flex items-center justify-between py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center group" aria-label="Inicio - Autotron">
          <motion.span className="text-2xl font-heading font-bold neon-text relative" whileHover={{ scale: 1.05 }}>
            {COMPANY_DATA.name}
            <span className="text-accent-neon neon-flicker">TRON</span>
          </motion.span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6" aria-label="Navegación principal">
          <NavLink href="/" isActive={pathname === "/"}>
            Inicio
          </NavLink>
          <NavLink href="/vehiculos" isActive={pathname === "/vehiculos" || pathname.startsWith("/vehiculos/")}>
            Vehículos
          </NavLink>
          <NavLink href="/servicios" isActive={pathname === "/servicios"}>
            Servicios
          </NavLink>
          <NavLink href="/financiamiento" isActive={pathname === "/financiamiento"}>
            Financiamiento
          </NavLink>
          <NavLink href="/contacto" isActive={pathname === "/contacto"}>
            Contacto
          </NavLink>
          
          {/* Auth Links Desktop */}
          {!authLoading && (
            <>
              {currentUser ? (
                <div className="relative group">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center text-white hover:text-accent-neon transition-colors">
                        <UserIcon className="w-5 h-5 mr-2" />
                        {currentUser.name || currentUser.email?.split('@')[0]}
                        <ChevronDown className="w-4 h-4 ml-1 group-hover:rotate-180 transition-transform" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-primary-light border-accent-neon/50 text-white">
                      <DropdownMenuItem asChild>
                        <Link href="/perfil" className="hover:bg-accent-neon/20">Mi Perfil</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/cambiar-contraseña" className="hover:bg-accent-neon/20">Cambiar Contraseña</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-accent-neon/30" />
                      <DropdownMenuItem onClick={handleLogout} className="cursor-pointer hover:bg-accent-neon/20 text-red-400 hover:text-red-300">
                        <LogOut className="w-4 h-4 mr-2" />
                        Cerrar Sesión
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <>
                  <NavLink href="/login" isActive={pathname === "/login"}>
                    <LogIn className="w-5 h-5 mr-1 inline-block" /> Iniciar Sesión
                  </NavLink>
                  {/* <NavLink href="/signup" isActive={pathname === "/signup"}>
                     Registrarse
                  </NavLink> */}
                </>
              )}
            </>
          )}
          {authLoading && <div className="text-white">Cargando...</div>}

          <div className="flex items-center space-x-4 ml-4" aria-label="Redes sociales">
            <SocialIcon
              href={COMPANY_DATA.socialMedia.facebook}
              icon={<Facebook className="w-5 h-5" />}
              label="Facebook"
            />
            <SocialIcon
              href={COMPANY_DATA.socialMedia.instagram}
              icon={<Instagram className="w-5 h-5" />}
              label="Instagram"
            />
            <SocialIcon
              href={COMPANY_DATA.socialMedia.twitter}
              icon={<Twitter className="w-5 h-5" />}
              label="Twitter"
            />
          </div>
        </nav>

        {/* CTA Button */}
        <Link href="/test-drive" className="hidden md:block btn-primary group">
          <span className="relative z-10">Agendar Test-Drive</span>
          <span className="absolute -inset-[1px] rounded-md bg-gradient-to-r from-accent-neon/0 via-accent-neon/50 to-accent-neon/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse-slow"></span>
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            className="md:hidden bg-primary-light/95 backdrop-blur-md"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container-custom py-4 flex flex-col space-y-4">
              <MobileNavLink href="/" onClick={() => setIsOpen(false)} isActive={pathname === "/"}>
                Inicio
              </MobileNavLink>
              <MobileNavLink
                href="/vehiculos"
                onClick={() => setIsOpen(false)}
                isActive={pathname === "/vehiculos" || pathname.startsWith("/vehiculos/")}
              >
                Vehículos
              </MobileNavLink>
              <MobileNavLink href="/servicios" onClick={() => setIsOpen(false)} isActive={pathname === "/servicios"}>
                Servicios
              </MobileNavLink>
              <MobileNavLink href="/contacto" onClick={() => setIsOpen(false)} isActive={pathname === "/contacto"}>
                Contacto
              </MobileNavLink>
              
              {/* Auth Links Mobile */}
              {!authLoading && (
                <>
                  {currentUser ? (
                    <>
\n
                      <MobileNavLink href="/perfil" onClick={() => setIsOpen(false)} isActive={pathname === "/perfil"}>
                        <UserIcon className="w-5 h-5 mr-2 inline-block" /> Mi Perfil
                      </MobileNavLink>
                      <MobileNavLink href="/cambiar-contraseña" onClick={() => setIsOpen(false)} isActive={pathname === "/cambiar-contraseña"}>
                        Cambiar Contraseña
                      </MobileNavLink>
                      <NavLink href="/financiamiento" isActive={pathname === "/financiamiento"}>
                        Financiamiento
                      </NavLink>
                      <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
                        <button
                          onClick={() => { handleLogout(); setIsOpen(false); }}
                          className="transition-colors py-2 block text-red-400 hover:text-red-300 w-full text-left"
                        >
                          <LogOut className="w-5 h-5 mr-2 inline-block" /> Cerrar Sesión
                        </button>
                      </motion.div>
                    </>
                  ) : (
                    <>
                      <MobileNavLink href="/login" onClick={() => setIsOpen(false)} isActive={pathname === "/login"}>
                        <LogIn className="w-5 h-5 mr-2 inline-block" /> Iniciar Sesión
                      </MobileNavLink>
                      {/* <MobileNavLink href="/signup" onClick={() => setIsOpen(false)} isActive={pathname === "/signup"}>
                         Registrarse
                      </MobileNavLink> */}
                    </>
                  )}
                </>
              )}
              {authLoading && <div className="text-white px-2 py-2">Cargando...</div>}

              <Link href="/test-drive" className="btn-primary w-full text-center" onClick={() => setIsOpen(false)}>
                Agendar Test-Drive
              </Link>
              <div className="flex items-center space-x-6 pt-4">
                <SocialIcon
                  href={COMPANY_DATA.socialMedia.facebook}
                  icon={<Facebook className="w-5 h-5" />}
                  label="Facebook"
                />
                <SocialIcon
                  href={COMPANY_DATA.socialMedia.instagram}
                  icon={<Instagram className="w-5 h-5" />}
                  label="Instagram"
                />
                <SocialIcon
                  href={COMPANY_DATA.socialMedia.twitter}
                  icon={<Twitter className="w-5 h-5" />}
                  label="Twitter"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

// Desktop Nav Link with hover effect
const NavLink = ({ href, children, isActive }: { href: string; children: React.ReactNode; isActive: boolean }) => {
  return (
    <Link href={href} className="relative group">
      <span
        className={cn("transition-colors", isActive ? "text-accent-neon" : "text-white group-hover:text-accent-neon")}
      >
        {children}
      </span>
      <span
        className={cn(
          "absolute bottom-0 left-0 w-full h-[2px] bg-accent-neon transform transition-transform duration-300 origin-left",
          isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
        )}
      ></span>
    </Link>
  )
}

// Mobile Nav Link with animation
const MobileNavLink = ({
  href,
  onClick,
  children,
  isActive,
}: { href: string; onClick: () => void; children: React.ReactNode; isActive: boolean }) => {
  return (
    <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
      <Link
        href={href}
        className={cn(
          "transition-colors py-2 block",
          isActive ? "text-accent-neon" : "text-white hover:text-accent-neon",
        )}
        onClick={onClick}
      >
        {children}
      </Link>
    </motion.div>
  )
}

// Social Media Icon with hover effect
const SocialIcon = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => {
  return (
    <Link href={href} aria-label={label} className="group">
      <motion.div
        whileHover={{ scale: 1.2, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        className="text-white group-hover:text-accent-neon transition-colors"
      >
        {icon}
      </motion.div>
    </Link>
  )
}

export default Navbar
