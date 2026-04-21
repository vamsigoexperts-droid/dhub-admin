// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import { resolve } from 'path';
// import fs from 'fs/promises';
// import svgr from '@svgr/rollup';

// // https://vitejs.dev/config/
// export default defineConfig({
//   resolve: {
//     alias: {
//       src: resolve(__dirname, 'src'),
//     },
//   },
//   esbuild: {
//     loader: 'jsx',
//     include: /src\/.*\.jsx?$/,
//     exclude: [],
//   },
//   optimizeDeps: {
//     esbuildOptions: {
//       loader: {
//         '.js': 'jsx',
//       },
//       plugins: [
//         {
//           name: 'load-js-files-as-jsx',
//           setup(build) {
//             build.onLoad({ filter: /src\\.*\.js$/ }, async (args) => ({
//               loader: 'jsx',
//               contents: await fs.readFile(args.path, 'utf8'),
//             }));
//           },
//         },
//       ],
//     },
//   },

//   // plugins: [react(),svgr({
//   //   exportAsDefault: true
//   // })],

//   plugins: [svgr(), react()],
// });


import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import fs from 'fs/promises';
import svgr from '@svgr/rollup';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const proxyTarget = env.VITE_DEV_PROXY_TARGET || 'http://127.0.0.1:5011';

  return {
  // Dev: browser calls same-origin /v1/... → proxied to local Node (see .env.development).
  server: {
    proxy: {
      '/v1': {
        target: proxyTarget,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      src: resolve(__dirname, 'src'),
    },
    // One copy of CKEditor 5 core (avoids ckeditor-duplicated-modules with Vite pre-bundling)
    dedupe: ['ckeditor5', '@ckeditor/ckeditor5-core', '@ckeditor/ckeditor5-engine', '@ckeditor/ckeditor5-utils'],
  },
  esbuild: {
    loader: 'jsx',
    include: [/src\/.*\.js$/, /src\/.*\.jsx$/],
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
      plugins: [
        {
          name: 'load-js-files-as-jsx',
          setup(build) {
            build.onLoad({ filter: /src\\.*\.js$/ }, async (args) => ({
              loader: 'jsx',
              contents: await fs.readFile(args.path, 'utf8'),
            }));
          },
        },
      ],
    },
  },

  // plugins: [react(),svgr({
  //   exportAsDefault: true
  // })],

  plugins: [svgr({ exportAsDefault: true }), react()],
};
});

// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import { resolve } from 'path';
// import fs from 'fs/promises';
// import svgr from '@svgr/rollup';

// // https://vitejs.dev/config/
// export default defineConfig({
//   resolve: {
//     alias: {
//       src: resolve(__dirname, 'src'),
//     },
//   },
//   esbuild: {
//     loader: 'jsx',
//     include: [/src\/.*\.js$/, /src\/.*\.jsx$/],
//     exclude: [],
//   },
//   optimizeDeps: {
//     esbuildOptions: {
//       loader: {
//         '.js': 'jsx',
//       },
//       plugins: [
//         {
//           name: 'load-js-files-as-jsx',
//           setup(build) {
//             build.onLoad({ filter: /src\/.*\.js$/ }, async (args) => ({
//               loader: 'jsx',
//               contents: await fs.readFile(args.path, 'utf8'),
//             }));
//           },
//         },
//       ],
//     },
//   },
//   plugins: [svgr({ exportAsDefault: true }), react()],
// });