"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { User, Lock, Palette, Clock, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "next-themes";
import { fetchJson } from "@/lib/api";
import Image from "next/image";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const [settings, setSettings] = useState({
    autoLockMinutes: 15,
    defaultView: "grid",
    twoFactorEnabled: false,
  });

  const [name, setName] = useState(session?.user?.name || "");
  const [email, setEmail] = useState(session?.user?.email || "");
  const [masterPasswordDialogOpen, setMasterPasswordDialogOpen] = useState(false);
  const [deleteAccountDialogOpen, setDeleteAccountDialogOpen] = useState(false);
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(session?.user?.image || "/avatars/avatar-1.svg");

  const avatars = [
    "/avatars/avatar-1.svg",
    "/avatars/avatar-2.svg",
    "/avatars/avatar-3.svg",
    "/avatars/avatar-4.svg",
    "/avatars/avatar-5.svg",
    "/avatars/avatar-6.svg",
    "/avatars/avatar-7.svg",
    "/avatars/avatar-8.svg",
    "/avatars/avatar-9.svg",
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if (session?.user?.image) {
      setSelectedAvatar(session.user.image);
    }
  }, [session?.user?.image]);

  const fetchSettings = async () => {
    try {
      const data = await fetchJson<{ autoLockMinutes: number; defaultView: string; twoFactorEnabled: boolean }>(
        "/api/settings"
      );
      setSettings(data);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load settings",
        variant: "destructive",
      });
    }
  };

  const handleSaveSettings = async () => {
    try {
      await fetchJson("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      toast({
        title: "Success",
        description: "Settings saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save settings",
        variant: "destructive",
      });
    }
  };

  const handleChangeMasterPassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters",
        variant: "destructive",
      });
      return;
    }

    try {
      await fetchJson("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      toast({
        title: "Success",
        description: "Master password updated successfully",
      });
      setMasterPasswordDialogOpen(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to change password",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      toast({
        title: "Error",
        description: 'Please type "DELETE" to confirm',
        variant: "destructive",
      });
      return;
    }

    try {
      await fetchJson("/api/auth/delete-account", {
        method: "DELETE",
      });

      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted",
      });
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete account",
        variant: "destructive",
      });
    }
  };

  const handleSaveAvatar = async () => {
    try {
      await fetchJson("/api/settings/avatar", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar: selectedAvatar }),
      });

      // Update the session with new avatar
      await update({
        ...session,
        user: {
          ...session?.user,
          image: selectedAvatar,
        },
      });

      toast({
        title: "Success",
        description: "Avatar updated successfully",
      });
      setAvatarDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update avatar",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-4xl space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Settings</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Manage your account and preferences</p>
      </div>

      {/* Account Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Account Information
            </CardTitle>
            <CardDescription>Update your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                disabled
                placeholder="you@example.com"
              />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Label>Avatar</Label>
              <div className="flex items-center gap-4">
                <Image
                  src={selectedAvatar}
                  alt="Avatar"
                  width={64}
                  height={64}
                  className="rounded-full"
                />
                <Button variant="outline" onClick={() => setAvatarDialogOpen(true)} className="w-full sm:w-auto">
                  Change Avatar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Security Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Preferences
          </CardTitle>
          <CardDescription>Customize your vault experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label>Theme</Label>
              <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("light")}
              >
                Light
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("dark")}
              >
                Dark
              </Button>
              <Button
                variant={theme === "system" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("system")}
              >
                System
              </Button>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label>Default View</Label>
              <p className="text-sm text-muted-foreground">Choose how to display vault items</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={settings.defaultView === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setSettings({ ...settings, defaultView: "grid" })}
              >
                Grid
              </Button>
              <Button
                variant={settings.defaultView === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setSettings({ ...settings, defaultView: "list" })}
              >
                List
              </Button>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Auto-Lock Timer
              </Label>
              <p className="text-sm text-muted-foreground">
                Lock vault after {settings.autoLockMinutes} minutes of inactivity
              </p>
            </div>
            <Input
              type="number"
              value={settings.autoLockMinutes}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  autoLockMinutes: Number.isNaN(Number(e.target.value))
                    ? settings.autoLockMinutes
                    : parseInt(e.target.value, 10),
                })
              }
              className="w-20"
              min={1}
              max={120}
            />
          </div>

          <Button onClick={handleSaveSettings}>Save Preferences</Button>
        </CardContent>
      </Card>
      </motion.div>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Security
          </CardTitle>
          <CardDescription>Manage security settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
            </div>
            <Switch
              checked={settings.twoFactorEnabled}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, twoFactorEnabled: checked })
              }
              disabled
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Change Master Password</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Update your master password (will re-encrypt all passwords)
            </p>
            <Button variant="outline" onClick={() => setMasterPasswordDialogOpen(true)}>
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-500">
            <Trash2 className="w-5 h-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>Irreversible actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Delete Account</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Permanently delete your account and all data
            </p>
            <Button variant="destructive" onClick={() => setDeleteAccountDialogOpen(true)}>
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Master Password Dialog */}
      <Dialog open={masterPasswordDialogOpen} onOpenChange={setMasterPasswordDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change Master Password</DialogTitle>
            <DialogDescription>
              Enter your current password and choose a new one
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMasterPasswordDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleChangeMasterPassword}>Update Password</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={deleteAccountDialogOpen} onOpenChange={setDeleteAccountDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-red-500">Delete Account</DialogTitle>
            <DialogDescription>
              This action cannot be undone. All your passwords and data will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="deleteConfirm">Type &quot;DELETE&quot; to confirm</Label>
              <Input
                id="deleteConfirm"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteAccountDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteAccount}>
              Delete My Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Avatar Selection Dialog */}
      <Dialog open={avatarDialogOpen} onOpenChange={setAvatarDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Choose Avatar</DialogTitle>
            <DialogDescription>Select an avatar for your profile</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4 py-4">
            {avatars.map((avatar) => (
              <button
                key={avatar}
                onClick={() => setSelectedAvatar(avatar)}
                className={`relative rounded-full p-2 transition-all ${
                  selectedAvatar === avatar
                    ? "ring-4 ring-primary scale-110"
                    : "hover:scale-105 opacity-70 hover:opacity-100"
                }`}
              >
                <Image src={avatar} alt="Avatar" width={80} height={80} className="rounded-full" />
              </button>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAvatarDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveAvatar}>Save Avatar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
