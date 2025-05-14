"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import UserService from '@/lib/services/user-service';
import { supabase } from '@/lib/supabase'; // For fetching vehicle details
import { type Vehicle } from '@/lib/types'; // Assuming you have a Vehicle type
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Trash2, Eye } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function FavoritesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [favoriteVehicles, setFavoriteVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserDataAndFavorites = async () => {
      setLoading(true);
      const user = await UserService.getCurrentUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUserId(user.id);

      const favoriteIds = await UserService.getFavoriteVehicleIds();
      if (favoriteIds.length > 0) {
        const { data: vehiclesData, error } = await supabase
          .from('vehicles')
          .select('*')
          .in('id', favoriteIds);

        if (error) {
          console.error('Error fetching favorite vehicles:', error);
          toast({
            title: 'Error',
            description: 'No se pudieron cargar los vehículos favoritos.',
            variant: 'destructive',
          });
          setFavoriteVehicles([]);
        } else {
          setFavoriteVehicles(vehiclesData as Vehicle[]);
        }
      } else {
        setFavoriteVehicles([]);
      }
      setLoading(false);
    };

    fetchUserDataAndFavorites();
  }, [router, toast]);

  const handleRemoveFavorite = async (vehicleId: number) => {
    if (!userId) return;

    const previousFavorites = [...favoriteVehicles];
    setFavoriteVehicles(prev => prev.filter(v => v.id !== vehicleId)); // Optimistic update

    const updatedFavoriteIds = await UserService.toggleFavorite(vehicleId);
    
    // Refetch or update based on returned IDs if needed, but optimistic is usually fine
    // For simplicity, we'll rely on the optimistic update. If toggleFavorite fails, we can revert.
    const isStillFavorite = updatedFavoriteIds.includes(vehicleId);
    if (isStillFavorite) { // Error occurred, or was not actually removed
        // Revert optimistic update if removal failed
        // This check might be tricky if toggleFavorite always returns the new list
        // A more robust way is to check the response from toggleFavorite or re-fetch
        const { data: vehicleStillFavorite } = await supabase
            .from('user_favorites')
            .select('id')
            .eq('user_id', userId)
            .eq('vehicle_id', vehicleId)
            .single();
        if(vehicleStillFavorite){
            setFavoriteVehicles(previousFavorites);
            toast({
                title: 'Error',
                description: 'No se pudo quitar el vehículo de favoritos.',
                variant: 'destructive',
            });
        } else {
             toast({
                title: 'Favorito Eliminado',
                description: 'El vehículo ha sido eliminado de tus favoritos.',
            });
        }
    } else {
        toast({
            title: 'Favorito Eliminado',
            description: 'El vehículo ha sido eliminado de tus favoritos.',
        });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-primary-dark">
        <div className="text-white text-xl">Cargando tus vehículos favoritos...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary-dark py-12 pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white neon-text">
            Mis Vehículos Favoritos
            </h1>
            <Button onClick={() => router.push('/vehiculos')} variant="outline" className="text-accent-neon border-accent-neon hover:bg-accent-neon/10">
                Explorar más vehículos
            </Button>
        </div>

        {favoriteVehicles.length === 0 ? (
          <div className="text-center py-10 bg-primary-light rounded-lg shadow-xl border border-accent-neon/20">
            <Heart size={48} className="mx-auto text-gray-500 mb-4" />
            <p className="text-xl text-gray-300 mb-2">Aún no tienes vehículos favoritos.</p>
            <p className="text-gray-400">Explora nuestro catálogo y añade los que más te gusten.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteVehicles.map((vehicle) => (
              <Card key={vehicle.id} className="bg-primary-light border-accent-neon/30 text-white overflow-hidden shadow-lg hover:shadow-accent-neon/20 transition-shadow duration-300">
                <CardHeader className="p-0">
                  <div className="aspect-video relative w-full">
                    <Image 
                        src={vehicle.images?.[0] || '/placeholder.svg'} 
                        alt={`${vehicle.brand} ${vehicle.model}`}
                        layout="fill"
                        objectFit="cover"
                        className="hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-xl font-bold neon-text-subtle truncate mb-1">{vehicle.brand} {vehicle.model}</CardTitle>
                  <p className="text-accent-neon font-semibold text-lg mb-2">${Number(vehicle.price).toLocaleString()}</p>
                  <p className="text-sm text-gray-400 capitalize">{vehicle.year} - {vehicle.mileage?.toLocaleString() || 0} km - {vehicle.fuel_type}</p>
                </CardContent>
                <CardFooter className="p-4 flex justify-between items-center bg-primary-dark/30">
                  <Button variant="ghost" size="sm" onClick={() => handleRemoveFavorite(vehicle.id)} className="text-red-500 hover:text-red-400 hover:bg-red-500/10">
                    <Trash2 size={16} className="mr-2" /> Quitar
                  </Button>
                  <Link href={`/vehiculos/${vehicle.id}`} passHref>
                    <Button variant="outline" size="sm" className="text-accent-neon border-accent-neon hover:bg-accent-neon/10">
                      <Eye size={16} className="mr-2" /> Ver Detalles
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}