/**
 * Format a date string into a relative "time ago" label.
 */
export function formatTimeAgo(dateString: string): string {
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const seconds = Math.floor((now - then) / 1000);

  if (seconds < 60) return "just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;

  const years = Math.floor(months / 12);
  return `${years}y ago`;
}

/**
 * Generate a DiceBear avatar URL from a name string.
 */
export function getAvatarUrl(name: string): string {
  const seed = encodeURIComponent(name.trim() || "anonymous");
  return `https://api.dicebear.com/9.x/initials/svg?seed=${seed}`;
}
