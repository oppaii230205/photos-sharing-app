// Utility functions and constants

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

// Build the full URL to an uploaded image
export function getImageUrl(photoUrl: string): string {
  // photoUrl is like "/uploads/filename.jpg"
  const baseUrl = API_URL.replace("/api", "");
  return `${baseUrl}${photoUrl}`;
}

// Format a date string for display
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
