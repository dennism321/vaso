import { createReadStream, promises as fs } from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { ZipArchive } from "archiver";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * Streams the project source + public assets as a ZIP file.
 * - Requires admin authentication.
 * - Excludes secrets (.env), node_modules, build caches and OS junk.
 * - Wraps everything in a `vasopantazi-site/` root folder inside the ZIP
 *   so the recipient can unzip it into any folder cleanly.
 */

const PROJECT_ROOT = process.cwd();
const ROOT_FOLDER = "vasopantazi-site";

/** Directories and files that must never leave this machine. */
const SKIP_NAMES = new Set([
  "node_modules",
  ".next",
  ".git",
  ".DS_Store",
  ".env",
  ".env.local",
  ".env.production",
  ".env.development",
  ".env.test",
  "tsconfig.tsbuildinfo",
  ".turbo",
  ".cache",
  ".vercel",
  ".swc",
  ".eslintcache",
  "npm-debug.log",
  ".npmrc",
]);

/** Files at the project root that should be included even if they aren't inside `src` or `public`. */
const ROOT_ALLOWLIST = new Set([
  "package.json",
  "package-lock.json",
  "tsconfig.json",
  "next.config.ts",
  "next-env.d.ts",
  "drizzle.config.ts",
  "postcss.config.mjs",
  "eslint.config.mjs",
  ".env.example",
  "README.md",
  ".gitignore",
]);

async function collectFiles(dir: string, rel = ""): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    if (SKIP_NAMES.has(entry.name)) continue;
    if (entry.name.startsWith(".") && entry.name !== ".env.example" && entry.name !== ".gitignore") continue;
    const childRel = rel ? `${rel}/${entry.name}` : entry.name;
    const childAbs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(childAbs, childRel)));
    } else if (entry.isFile()) {
      files.push(childRel);
    }
  }
  return files;
}

export async function GET() {
  await requireAdmin();

  const archive = new ZipArchive({ zlib: { level: 9 } });

  // Walk `src/` and `public/` recursively.
  const [srcFiles, publicFiles] = await Promise.all([
    collectFiles(path.join(PROJECT_ROOT, "src"), "src"),
    collectFiles(path.join(PROJECT_ROOT, "public"), "public"),
  ]);

  for (const file of srcFiles) {
    archive.append(createReadStream(path.join(PROJECT_ROOT, file)), { name: `${ROOT_FOLDER}/${file}` });
  }
  for (const file of publicFiles) {
    const fullPath = path.join(PROJECT_ROOT, file);
    archive.append(createReadStream(fullPath), { name: `${ROOT_FOLDER}/${file}` });
  }

  // Root-level files from the allowlist.
  for (const name of ROOT_ALLOWLIST) {
    try {
      await fs.access(path.join(PROJECT_ROOT, name));
      archive.append(createReadStream(path.join(PROJECT_ROOT, name)), { name: `${ROOT_FOLDER}/${name}` });
    } catch {
      // Missing files are silently skipped — keeps the route robust across environments.
    }
  }

  archive.finalize();

  const webStream = Readable.toWeb(archive) as unknown as ReadableStream<Uint8Array>;

  const filename = `vasopantazi-site-${new Date().toISOString().slice(0, 10)}.zip`;
  return new Response(webStream, {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
