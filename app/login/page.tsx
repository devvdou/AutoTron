"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { LogIn } from 'lucide-react';
import UserService from '@/lib/services/user-service';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      const currentUser = await UserService.getCurrentUser();
      if (currentUser) {
        router.push('/perfil'); // Redirect if already logged in
      }
    };
    getCurrentUser();
  }, [router]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        toast({
          title: 'Error de inicio de sesión',
          description: error.message || 'No se pudo iniciar sesión. Verifica tus credenciales.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Inicio de sesión exitoso',
          description: 'Redirigiendo a tu perfil...',
        });
        router.push('/perfil');
        router.refresh(); // To update navbar state
      }
    } catch (error: any) {
      toast({
        title: 'Error inesperado',
        description: error.message || 'Ocurrió un error durante el inicio de sesión.',
        variant: 'destructive',
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-primary-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-primary-light p-10 rounded-xl shadow-2xl border border-accent-neon/30">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white neon-text">
            Iniciar Sesión
          </h2>
          {/* <p className="mt-2 text-center text-sm text-gray-300">
            ¿No tienes cuenta?{' '}
            <Link href="/signup" className="font-medium text-accent-neon hover:text-accent-neon-light">
              Regístrate aquí
            </Link>
          </p> */}
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <Label htmlFor="email-address" className="sr-only">
                Correo Electrónico
              </Label>
              <Input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-accent-neon focus:border-accent-neon focus:z-10 sm:text-sm rounded-t-md"
                placeholder="Correo Electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="password" className="sr-only">
                Contraseña
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-accent-neon focus:border-accent-neon focus:z-10 sm:text-sm rounded-b-md"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              {/* <Link href="/forgot-password" className="font-medium text-accent-neon hover:text-accent-neon-light">
                ¿Olvidaste tu contraseña?
              </Link> */}
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-accent-neon hover:bg-accent-neon-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-neon-dark disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <LogIn className="mr-2 h-5 w-5" />
              )}
              {loading ? 'Iniciando...' : 'Iniciar Sesión'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}