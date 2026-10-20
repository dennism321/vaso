import { asset } from "@/lib/paths";

/** Static export: serve images as they are, adding the base path to local files. */
export default function imageLoader({ src }: { src: string; width: number; quality?: number }) {
  return asset(src);
}
