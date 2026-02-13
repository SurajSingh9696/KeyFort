"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Copy, Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { generatePassword, calculatePasswordStrength } from "@/lib/encryption";

export default function GeneratorPage() {
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const [options, setOptions] = useState({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });

  const handleGenerate = () => {
    try {
      const newPassword = generatePassword(options);
      setPassword(newPassword);
      setCopied(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate password",
        variant: "destructive",
      });
    }
  };

  const handleCopy = async () => {
    if (!password) return;

    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Password copied to clipboard",
      });

      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const strength = password ? calculatePasswordStrength(password) : { score: 0, label: "", percentage: 0 };

  const getStrengthColor = (score: number) => {
    if (score === 0) return "bg-gray-300";
    if (score === 1) return "bg-red-500";
    if (score === 2) return "bg-orange-500";
    if (score === 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Password Generator</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Generate strong, secure passwords</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Generated Password</CardTitle>
            <CardDescription>Customize your password settings below</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            {/* Password Display */}
            <div className="relative">
              <div className="flex items-center gap-2 p-3 sm:p-4 bg-muted rounded-lg font-mono text-base sm:text-lg break-all">
                {password || "Click generate to create a password"}
              </div>
              {password && (
                <div className="absolute right-2 top-2 flex gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleCopy}
                    className="h-8 w-8"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              )}
            </div>

            {/* Strength Indicator */}
            {password && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Password Strength:</span>
                  <span className="font-medium">{strength.label}</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${getStrengthColor(strength.score)}`}
                    style={{ width: `${strength.percentage}%` }}
                  />
                </div>
              </div>
            )}

            {/* Length Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Length: {options.length}</Label>
              </div>
              <Slider
                value={[options.length]}
                onValueChange={([value]) => setOptions({ ...options, length: value })}
                min={8}
                max={64}
                step={1}
                className="w-full"
              />
            </div>

            {/* Options */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="uppercase">Uppercase Letters (A-Z)</Label>
                <Switch
                  id="uppercase"
                  checked={options.uppercase}
                  onCheckedChange={(checked) => setOptions({ ...options, uppercase: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="lowercase">Lowercase Letters (a-z)</Label>
                <Switch
                  id="lowercase"
                  checked={options.lowercase}
                  onCheckedChange={(checked) => setOptions({ ...options, lowercase: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="numbers">Numbers (0-9)</Label>
                <Switch
                  id="numbers"
                  checked={options.numbers}
                  onCheckedChange={(checked) => setOptions({ ...options, numbers: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="symbols">Symbols (!@#$%...)</Label>
                <Switch
                  id="symbols"
                  checked={options.symbols}
                  onCheckedChange={(checked) => setOptions({ ...options, symbols: checked })}
                />
              </div>
            </div>

            {/* Generate Button */}
            <Button onClick={handleGenerate} className="w-full" size="lg">
              <RefreshCw className="w-4 h-4 mr-2" />
              Generate Password
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tips Card */}
      <Card>
        <CardHeader>
          <CardTitle>Password Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Use at least 12 characters for strong security</li>
            <li>• Include a mix of letters, numbers, and symbols</li>
            <li>• Avoid common words and personal information</li>
            <li>• Use unique passwords for each account</li>
            <li>• Consider using a passphrase for memorability</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
