import fs from 'node:fs';
import path from 'node:path';
import { visualizer } from 'rollup-plugin-visualizer';

export const PRODUCTION_MODE = 'production';
export const DEFAULT_SEEDERS_DIR_NAME = 'dist/seeders';
export const ANALYZE_ENV_VAR = 'ANALYZE';
export const ANALYZE_ACTIVE_FLAG = '1';
export const ANALYZE_DIR_NAME = '.analyze';
export const ANALYZE_STATS_FILENAME = 'stats.html';
export const DEFAULT_TOP_MODULES_LIMIT = 5;

export interface ExcludeDemoSeedersOptions {
  seedersRelPath?: string;
}

export function excludeDemoSeedersPlugin(
  mode: string,
  baseDir: string,
  options?: ExcludeDemoSeedersOptions
) {
  const seedersDir = path.resolve(
    baseDir,
    options?.seedersRelPath ?? DEFAULT_SEEDERS_DIR_NAME
  );

  return {
    name: 'exclude-demo-seeders',
    closeBundle() {
      if (mode === PRODUCTION_MODE && fs.existsSync(seedersDir)) {
        fs.rmSync(seedersDir, { recursive: true, force: true });
      }
    },
  };
}

export interface EntryChunkAnalyzerOptions {
  topLimit?: number;
}

export function entryChunkAnalyzerPlugin(options?: EntryChunkAnalyzerOptions) {
  const topLimit = options?.topLimit ?? DEFAULT_TOP_MODULES_LIMIT;

  return {
    name: 'entry-chunk-analyzer',
    generateBundle(_options: unknown, bundle: Record<string, unknown>) {
      for (const [fileName, rawItem] of Object.entries(bundle)) {
        const item = rawItem as {
          type?: string;
          isEntry?: boolean;
          modules?: Record<string, { renderedLength: number }>;
        };
        if (item.type === 'chunk' && item.isEntry && item.modules) {
          const mods = Object.entries(item.modules).map(([id, mod]) => ({
            id: id.includes('/node_modules/')
              ? id.substring(id.lastIndexOf('/node_modules/') + 14)
              : path.basename(id),
            fullPath: id,
            size: mod.renderedLength,
          }));

          mods.sort((a, b) => b.size - a.size);

          console.log(`\n=== [ENTRY CHUNK: ${fileName}] Top ${topLimit} Modules ===`);
          mods.slice(0, topLimit).forEach((m, i) => {
            console.log(`${i + 1}. ${(m.size / 1024).toFixed(2)} KB: ${m.id}`);
          });
          console.log(`==============================================\n`);
        }
      }
    },
  };
}

export interface BundleAnalyzerPluginsOptions {
  topLimit?: number;
}

export function createBundleAnalyzerPlugins(
  appDir: string,
  options?: BundleAnalyzerPluginsOptions
) {
  if (process.env[ANALYZE_ENV_VAR] !== ANALYZE_ACTIVE_FLAG) {
    return [];
  }

  const outputPath = path.resolve(
    appDir,
    ANALYZE_DIR_NAME,
    ANALYZE_STATS_FILENAME
  );

  return [
    entryChunkAnalyzerPlugin(options),
    visualizer({
      filename: outputPath,
      gzipSize: true,
      open: false,
    }),
  ];
}
