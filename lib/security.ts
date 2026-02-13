// Security analysis utilities

export interface SecurityAnalysis {
  score: number;
  weakPasswords: any[];
  reusedPasswords: any[];
  oldPasswords: any[];
  totalIssues: number;
}

export function calculateSecurityScore(vaultItems: any[]): SecurityAnalysis {
  // Analyze weak passwords (short encrypted strings indicate weak passwords)
  const weakPasswords = vaultItems.filter(
    (item: any) => item.encryptedPassword && item.encryptedPassword.length < 20
  );

  // Analyze old passwords (not updated in 90+ days)
  const oldPasswords = vaultItems.filter((item: any) => {
    const daysSinceUpdate = Math.floor(
      (Date.now() - new Date(item.updatedAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysSinceUpdate > 90;
  });

  // Analyze reused passwords
  const reuseMap = new Map<string, number>();
  vaultItems.forEach((item: any) => {
    if (!item.encryptedPassword) return;
    reuseMap.set(item.encryptedPassword, (reuseMap.get(item.encryptedPassword) || 0) + 1);
  });
  const reusedPasswords = vaultItems.filter(
    (item: any) =>
      item.encryptedPassword &&
      reuseMap.get(item.encryptedPassword) &&
      reuseMap.get(item.encryptedPassword)! > 1
  );

  // Calculate security score
  const totalIssues = weakPasswords.length + oldPasswords.length + reusedPasswords.length;
  const score = Math.max(0, Math.min(100, 100 - totalIssues * 10));

  return {
    score,
    weakPasswords,
    reusedPasswords,
    oldPasswords,
    totalIssues,
  };
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-500";
  if (score >= 60) return "text-yellow-500";
  return "text-red-500";
}

export function getScoreBgColor(score: number): string {
  if (score >= 80) return "bg-green-500";
  if (score >= 60) return "bg-yellow-500";
  return "bg-red-500";
}

export function getScoreLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";
  return "Poor";
}
