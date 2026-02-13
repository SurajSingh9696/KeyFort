"use client";

import { useState } from "react";
import { Eye, EyeOff, Copy, Star, MoreVertical, Trash2, Edit, ExternalLink } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";
import { decryptPassword } from "@/lib/encryption";

interface VaultItemCardProps {
  item: {
    id: string;
    title: string;
    username: string | null;
    encryptedPassword: string;
    website: string | null;
    notes: string | null;
    isFavorite: boolean;
    category: {
      name: string;
      color: string;
    } | null;
    updatedAt: string;
  };
  onEdit: (item: any) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (item: any) => void;
}

export default function VaultItemCard({
  item,
  onEdit,
  onDelete,
  onToggleFavorite,
}: VaultItemCardProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [decryptedPassword, setDecryptedPassword] = useState("");
  const { toast } = useToast();
  
  // Debug logging
  console.log("VaultItemCard item:", item);
  console.log("Item ID:", item.id);

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleViewPassword = async () => {
    if (showPassword) {
      setShowPassword(false);
      setDecryptedPassword("");
    } else {
      handleDecryptPassword();
    }
  };

  const handleDecryptPassword = () => {
    try {
      // Using demo master password - in production, this should be user's actual master password
      const decrypted = decryptPassword(item.encryptedPassword, "demo-master-password");
      setDecryptedPassword(decrypted);
      setShowPassword(true);
      toast({
        title: "Success",
        description: "Password decrypted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to decrypt password",
        variant: "destructive",
      });
    }
  };

  const getDisplayPassword = () => {
    return showPassword && decryptedPassword ? decryptedPassword : "••••••••";
  };

  const formatWebsiteUrl = (url: string) => {
    if (!url) return "";
    // Remove any localhost or relative path issues
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    // Remove localhost prefix if present
    const cleaned = url.replace(/^(https?:\/\/)?(localhost:\d+\/)?/, "");
    return `https://${cleaned}`;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="pt-4 sm:pt-6">
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg">{item.title}</h3>
              {item.isFavorite && <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />}
            </div>
            {item.category && (
              <span
                className="inline-block px-2 py-1 text-xs rounded-full"
                style={{
                  backgroundColor: `${item.category.color}20`,
                  color: item.category.color,
                }}
              >
                {item.category.name}
              </span>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(item)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onToggleFavorite(item)}>
                <Star className="w-4 h-4 mr-2" />
                {item.isFavorite ? "Remove from favorites" : "Add to favorites"}
              </DropdownMenuItem>
              {item.website && (
                <DropdownMenuItem
                  onClick={() => window.open(formatWebsiteUrl(item.website!), "_blank", "noopener,noreferrer")}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open website
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(item.id)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-2 sm:space-y-3">
          {item.username && (
            <div className="flex items-center gap-2 p-2 sm:p-3 bg-muted rounded">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Username</p>
                <p className="text-sm font-medium truncate">{item.username}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 flex-shrink-0 hover:bg-primary/10"
                onClick={() => handleCopy(item.username!, "Username")}
              >
                <Copy className="w-4 h-4 text-muted-foreground hover:text-primary" />
              </Button>
            </div>
          )}

          <div className="flex items-center gap-2 p-2 sm:p-3 bg-muted rounded">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Password</p>
              <p className="text-sm font-mono truncate">{getDisplayPassword()}</p>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-primary/10"
                onClick={handleViewPassword}
              >
                {showPassword ? <EyeOff className="w-4 h-4 text-muted-foreground hover:text-primary" /> : <Eye className="w-4 h-4 text-muted-foreground hover:text-primary" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-primary/10"
                onClick={() => {
                  if (showPassword && decryptedPassword) {
                    handleCopy(decryptedPassword, "Password");
                  } else {
                    toast({
                      title: "Info",
                      description: "Please decrypt the password first to copy it",
                      variant: "default",
                    });
                  }
                }}
              >
                <Copy className="w-4 h-4 text-muted-foreground hover:text-primary" />
              </Button>
            </div>
          </div>

          {item.website && (
            <div className="flex items-center gap-2 p-2 sm:p-3 bg-muted rounded">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-1">Website</p>
                <button
                  onClick={() => window.open(formatWebsiteUrl(item.website!), "_blank", "noopener,noreferrer")}
                  className="text-sm text-primary hover:underline flex items-center gap-1 w-full text-left group"
                >
                  <span className="truncate">{item.website}</span>
                  <ExternalLink className="w-3 h-3 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground border-t pt-3 sm:pt-4">
        Updated {formatDate(item.updatedAt)}
      </CardFooter>
    </Card>
  );
}
