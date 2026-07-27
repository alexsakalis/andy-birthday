import type { Photo } from "@/types/photo";

/**
 * ============================================================
 * EDIT HERE — Photo gallery
 * ============================================================
 * 1. Drop image files into /public/photos/
 * 2. Add an entry below with the filename, alt text, and caption
 * 3. Set isPlaceholder to false once the file exists
 *
 * Example:
 * {
 *   id: "photo-1",
 *   filename: "us-picnic.jpg",
 *   alt: "Anndrea and Alex at a picnic",
 *   caption: "Our sunny afternoon picnic",
 *   date: "June 2025",
 *   location: "The park",
 *   isPlaceholder: false,
 * }
 */

export const photos: Photo[] = [
  {
    id: "photo-1",
    filename: "memory-1.jpg",
    alt: "Placeholder for a favorite memory photo",
    caption: "Add your first favorite memory here",
    date: "Soon",
    location: "Wherever we were happiest",
    isPlaceholder: true,
  },
  {
    id: "photo-2",
    filename: "memory-2.jpg",
    alt: "Placeholder for a date night photo",
    caption: "A date night we’ll always remember",
    date: "Soon",
    isPlaceholder: true,
  },
  {
    id: "photo-3",
    filename: "memory-3.jpg",
    alt: "Placeholder for a cozy moment photo",
    caption: "One of our cozy little moments",
    date: "Soon",
    isPlaceholder: true,
  },
  {
    id: "photo-4",
    filename: "memory-4.jpg",
    alt: "Placeholder for an adventure photo",
    caption: "An adventure worth laughing about forever",
    date: "Soon",
    isPlaceholder: true,
  },
  {
    id: "photo-5",
    filename: "memory-5.jpg",
    alt: "Placeholder for a birthday countdown photo",
    caption: "Counting down to your birthday",
    date: "2026",
    isPlaceholder: true,
  },
  {
    id: "photo-6",
    filename: "memory-6.jpg",
    alt: "Placeholder for a sweet everyday photo",
    caption: "An ordinary day that felt extraordinary",
    date: "Soon",
    isPlaceholder: true,
  },
];
