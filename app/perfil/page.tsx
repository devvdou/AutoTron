"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function PerfilPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        router.push("/login");
      } else {
        setUser(data.user);
      }
      setLoading(false);
    };
    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Sesión cerrada", description: "Has cerrado sesión correctamente." });
    router.push("/login");
  };

  if (loading) {
    return <div className="p-6 text-center">Cargando perfil...</div>;
  }

  if (!user) {
    return <div className="p-6 text-center">No se encontró información de usuario.</div>;
  }

  return (
    <div className="p-6 pt-20 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Mi Perfil</h1>
      <div className="bg-primary-light rounded-lg shadow-md p-6 mb-6">
        <p><strong>Email:</strong> {user.email}</p>
        {/* Aquí puedes agregar más información del usuario si está disponible */}
      </div>
      <div className="flex flex-col md:flex-row gap-4 justify-center">
        {/* Botón para cambiar contraseña (puedes enlazar a una página o modal si existe) */}
        <Button variant="outline" className="text-accent-neon border-accent-neon hover:bg-accent-neon/10 w-full md:w-auto" onClick={() => router.push("/cambiar-contraseña")}>Cambiar Contraseña</Button>
        <Button variant="destructive" className="w-full md:w-auto" onClick={handleLogout}>Cerrar Sesión</Button>
      </div>
    </div>
  );
}