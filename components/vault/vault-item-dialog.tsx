"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lock, User, Globe, FileText, FolderOpen } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { encryptPassword } from "@/lib/encryption";
import { fetchJson } from "@/lib/api";

const vaultItemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  username: z.string().optional(),
  password: z.string().optional(),
  website: z.string().optional(),
  notes: z.string().optional(),
  categoryId: z.string().optional(),
  isFavorite: z.boolean().optional(),
});

type VaultItemFormData = z.infer<typeof vaultItemSchema>;

interface VaultItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: {
    id: string;
    title: string;
    username: string | null;
    encryptedPassword: string;
    website: string | null;
    notes: string | null;
    categoryId: string | null;
    isFavorite: boolean;
  } | null;
  onSave: (data: any) => void;
}

export default function VaultItemDialog({
  open,
  onOpenChange,
  item,
  onSave,
}: VaultItemDialogProps) {
  const [categories, setCategories] = useState<any[]>([]);
  const [masterPassword, setMasterPassword] = useState("");
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<VaultItemFormData>({
    resolver: zodResolver(vaultItemSchema),
    defaultValues: {
      isFavorite: false,
    },
  });

  const isFavorite = watch("isFavorite");

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (item) {
      reset({
        title: item.title,
        username: item.username || "",
        password: "", // Don't pre-fill password for security
        website: item.website || "",
        notes: item.notes || "",
        categoryId: item.categoryId || "",
        isFavorite: item.isFavorite,
      });
    } else {
      reset({
        title: "",
        username: "",
        password: "",
        website: "",
        notes: "",
        categoryId: "",
        isFavorite: false,
      });
    }
  }, [item, reset]);

  const fetchCategories = async () => {
    try {
      const data = await fetchJson<any[]>("/api/categories");
      setCategories(data);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load categories",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data: VaultItemFormData) => {
    try {
      // Validate password is provided when creating new item
      if (!item && !data.password) {
        toast({
          title: "Error",
          description: "Password is required",
          variant: "destructive",
        });
        return;
      }

      let encryptedPassword: string;
      
      if (data.password) {
        // New password provided - encrypt it
        encryptedPassword = encryptPassword(data.password, "demo-master-password");
      } else if (item) {
        // Editing without password change - keep existing encrypted password
        encryptedPassword = item.encryptedPassword;
      } else {
        toast({
          title: "Error",
          description: "Password is required",
          variant: "destructive",
        });
        return;
      }

      const payload = {
        title: data.title,
        username: data.username || null,
        encryptedPassword,
        website: data.website || null,
        notes: data.notes || null,
        categoryId: data.categoryId || null,
        isFavorite: data.isFavorite || false,
      };

      await onSave(payload);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save password",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] w-[calc(100vw-2rem)] flex flex-col p-0">
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6">
          <DialogTitle>{item ? "Edit Password" : "Add New Password"}</DialogTitle>
          <DialogDescription>
            {item ? "Update password details" : "Enter password details"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
          <div className="space-y-3 sm:space-y-4 overflow-y-auto px-4 sm:px-6 pr-3 sm:pr-4 max-h-[calc(90vh-200px)] py-3 sm:py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="title"
                  placeholder="e.g., Gmail Account"
                  className="pl-11"
                  {...register("title")}
                />
              </div>
              {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username/Email</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="username"
                  placeholder="user@example.com"
                  className="pl-11"
                  {...register("username")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                Password {item ? "(leave empty to keep current)" : "*"}
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder={item ? "Leave empty to keep current password" : "••••••••"}
                  className="pl-11"
                  autoComplete="new-password"
                  {...register("password")}
                />
              </div>
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website URL</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="website"
                  placeholder="https://example.com"
                  className="pl-11"
                  {...register("website")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoryId">Category</Label>
              <div className="relative">
                <FolderOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <select
                  id="categoryId"
                  className="w-full h-10 pl-11 pr-3 rounded-md border border-input bg-background"
                  {...register("categoryId")}
                >
                  <option value="">No category</option>
                  {categories.map((category) => (
                    <option key={category._id.toString()} value={category._id.toString()}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <textarea
                  id="notes"
                  placeholder="Additional notes..."
                  className="w-full min-h-[80px] pl-11 pr-3 py-2 rounded-md border border-input bg-background resize-none"
                  {...register("notes")}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="favorite">Add to favorites</Label>
              <Switch
                id="favorite"
                checked={isFavorite}
                onCheckedChange={(checked) => setValue("isFavorite", checked)}
              />
            </div>
          </div>

          <DialogFooter className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t px-4 sm:px-6 pb-4 sm:pb-6 flex-col-reverse sm:flex-row gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button type="submit" className="w-full sm:w-auto">{item ? "Update" : "Save"} Password</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
