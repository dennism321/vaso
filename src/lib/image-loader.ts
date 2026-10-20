import { asset } from "@/lib/paths";

/** Static export: serve images as-is, adding the GitHub Pages base path to local files. */
export default function imageLoader({ src }: { src: string; width: number; quality?: number }) {
  return asset(src);
}
