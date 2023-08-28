import autoprefixer from 'autoprefixer';
import { readFile } from 'fs/promises';
import postcss from 'postcss';
import postcssPresetEnv from 'postcss-preset-env';
import browserslist from 'browserslist';
import * as esbuild from 'esbuild';
import { resolveToEsbuildTarget } from 'esbuild-plugin-browserslist';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';
import packagejson from '../package.json' assert { type: 'json' };

/**
 * Configuration
 */
const __dirname = dirname(fileURLToPath(import.meta.url));
const __root_dir = resolve(__dirname, '..', 'src');
const css_input = join(__root_dir, 'styles', 'styles.css');

const shared_config = {
  bundle: true,
  entryNames: '[name]',
  loader: {
    '.eot': 'copy',
    '.svg': 'copy',
    '.ttf': 'copy',
    '.woff': 'copy',
    '.woff2': 'copy',
  },
  minify: true,
  sourcemap: true,
  target: [
    'es2021',
    ...resolveToEsbuildTarget(
      browserslist(packagejson.browserslist), { printUnknownTargets: true },
    ),
  ],
  write: true,
};

/**
 * [Step 1] PostCSS
 */
console.log('[Step 1] PostCSS');
const css_contents = await readFile(css_input, 'utf8');
const css_processor = postcss([autoprefixer, postcssPresetEnv()]);
const { css } = await css_processor.process(css_contents, { from: css_input });

/**
 * [Step 2] esbuild - CSS
 */
console.log('[Step 2] esbuild - CSS');
await esbuild.build({
  ...shared_config,
  outfile: join(__root_dir, 'assets', 'styles.css'),
  stdin: {
    contents: css,
    loader: 'css',
    resolveDir: join(__root_dir, 'styles'),
    sourcefile: css_input,
  },
});

/**
 * [Step 3] esbuild - JS
 */
console.log('[Step 3] esbuild - JS');
await esbuild.build({
  ...shared_config,
  entryPoints: [join(__root_dir, 'scripts', 'scripts.js')],
  format: 'esm',
  outdir: join(__root_dir, 'assets'),
  platform: 'browser',
});


/* LEGACY */

/**
 * [Step 4] PurgeCSS
 */
/*
console.log('[Step 4] PurgeCSS');
const purged_css_results = (await new PurgeCSS().purge({
  content: [
    join(__root_dir, '**', '*.html'),
    join(__root_dir, 'lib', '**', '*.js'),
    join(__root_dir, 'routes', '**', '*.js'),
  ],
  css: [output_styles],
  sourceMap: { to: output_styles },
}))[0];
await writeFile(purged_css_results.file, purged_css_results.css, { encoding: 'utf8', flag: 'w' });
await writeFile(join(__output_dir, 'styles.css.map'), purged_css_results.sourceMap, { encoding: 'utf8', flag: 'w' });
*/
