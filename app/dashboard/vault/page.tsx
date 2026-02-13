"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, Grid, List, Search, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import VaultItemCard from "@/components/vault/vault-item-card";
import VaultItemDialog from "@/components/vault/vault-item-dialog";
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

export default function VaultPage() {
  const searchParams = useSearchParams();
  const [vaultItems, setVaultItems] = useState<VaultItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<VaultItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<VaultItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Initialize search query from URL parameter
  useEffect(() => {
    const urlSearch = searchParams.get("search");
    if (urlSearch) {
      setSearchQuery(urlSearch);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchVaultItems();
  }, []);

  useEffect(() => {
    const filtered = vaultItems.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.website?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [searchQuery, vaultItems]);

  const fetchVaultItems = async () => {
    try {
      const data = await fetchJson<VaultItem[]>("/api/vault");
      console.log("Fetched vault items:", data);
      console.log("First item structure:", data[0]);
      setVaultItems(data);
      setFilteredItems(data);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch vault items",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (item: Partial<VaultItem>) => {
    console.log("handleSave called with:", item);
    console.log("selectedItem:", selectedItem);
    try {
      if (selectedItem) {
        // Update
        console.log("Updating item with ID:", selectedItem.id);
        const result = await fetchJson(`/api/vault/${selectedItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        });
        console.log("Update result:", result);
        toast({
          title: "Success",
          description: "Password updated successfully",
        });
        fetchVaultItems();
      } else {
        // Create
        console.log("Creating new item");
        const result = await fetchJson("/api/vault", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        });
        console.log("Create result:", result);
        toast({
          title: "Success",
          description: "Password saved successfully",
        });
        fetchVaultItems();
      }
      setIsDialogOpen(false);
      setSelectedItem(null);
    } catch (error) {
      console.error("Error in handleSave:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save password",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    console.log("Delete called with ID:", id);
    
    if (!id || id === "undefined") {
      toast({
        title: "Error",
        description: "Invalid item ID",
        variant: "destructive",
      });
      console.error("Invalid ID passed to handleDelete:", id);
      return;
    }
    
    try {
      await fetchJson(`/api/vault/${id}`, {
        method: "DELETE",
      });

      toast({
        title: "Success",
        description: "Password deleted successfully",
      });
      fetchVaultItems();
    } catch (error) {
      console.error("Error deleting item:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete password",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (item: VaultItem) => {
    console.log("Edit clicked for item:", item);
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleToggleFavorite = async (item: VaultItem) => {
    console.log("Toggle favorite for item:", item.id, "Current favorite:", item.isFavorite);
    try {
      const payload = {
        title: item.title,
        username: item.username,
        encryptedPassword: item.encryptedPassword,
        website: item.website,
        notes: item.notes,
        categoryId: item.categoryId,
        isFavorite: !item.isFavorite,
      };
      
      console.log("Sending payload:", payload);
      
      const result = await fetchJson(`/api/vault/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      console.log("API response:", result);
      
      toast({
        title: "Success",
        description: `Password ${!item.isFavorite ? "added to" : "removed from"} favorites`,
      });
      
      fetchVaultItems();
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update favorite status",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Vault</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage your secure passwords</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Add Password
        </Button>
      </div>

      {/* Search and View Toggle */}
      <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search passwords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            autoComplete="off"
            name="vault-search"
          />
        </div>
        <div className="flex border rounded-lg">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="icon"
            onClick={() => setViewMode("grid")}
            aria-label="Grid view"
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="icon"
            onClick={() => setViewMode("list")}
            aria-label="List view"
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Vault Items */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Lock className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchQuery ? "No passwords found" : "No passwords yet"}
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm text-center">
              {searchQuery
                ? `No passwords match "${searchQuery}". Try a different search term.`
                : "Get started by adding your first password to the vault."}
            </p>
            {!searchQuery && (
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Password
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div
          className={`grid gap-4 ${
            viewMode === "grid"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1"
          }`}
        >
          {filteredItems.map((item, index) => (
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

      {/* Dialog */}
      <VaultItemDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setSelectedItem(null);
        }}
        item={selectedItem}
        onSave={handleSave}
      />
    </div>
  );
}
