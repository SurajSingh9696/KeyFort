"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import VaultItemCard from "@/components/vault/vault-item-card";
import { useToast } from "@/hooks/use-toast";
import { fetchJson } from "@/lib/api";

interface VaultItem {
  id: string;
  title: string;
  username: string | null;
  encryptedPassword: string;
  website: string | null;
  notes: string | null;
  categoryId: string | null;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
    color: string;
  } | null;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<VaultItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const data = await fetchJson<VaultItem[]>("/api/vault?isFavorite=true");
      setFavorites(data);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch favorites",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetchJson(`/api/vault/${id}`, {
        method: "DELETE",
      });

      toast({
        title: "Success",
        description: "Password deleted successfully",
      });
      fetchFavorites();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete password",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (item: VaultItem) => {
    // Open edit dialog
    toast({
      title: "Coming soon",
      description: "Edit from vault page",
    });
  };

  const handleToggleFavorite = async (item: VaultItem) => {
    try {
      await fetchJson(`/api/vault/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...item, isFavorite: !item.isFavorite }),
      });
      fetchFavorites();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update favorite status",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center gap-2 sm:gap-3">
        <Star className="w-6 h-6 sm:w-8 sm:h-8 fill-yellow-500 text-yellow-500" />
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Favorites</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Quick access to your starred passwords</p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-12">
          <Star className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No favorite passwords yet</p>
          <p className="text-sm text-muted-foreground">
            Star passwords in your vault to see them here
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <VaultItemCard
                item={item}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleFavorite={handleToggleFavorite}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
