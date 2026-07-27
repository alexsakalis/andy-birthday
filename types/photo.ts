export type Photo = {
  id: string;
  /** Filename inside /public/photos, e.g. "us-1.jpg" */
  filename: string;
  alt: string;
  caption: string;
  date?: string;
  location?: string;
  /** When true, show a placeholder card instead of an image. */
  isPlaceholder?: boolean;
};
