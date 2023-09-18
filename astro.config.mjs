import { defineConfig } from 'astro/config';
import solid from '@astrojs/solid-js';
import tailwind from "@astrojs/tailwind";
import { i18n, defaultLocaleSitemapFilter } from 'astro-i18n-aut/integration';
import sitemap from '@astrojs/sitemap';
import cloudflare from "@astrojs/cloudflare";
import { defaultLang, languages } from './src/i18n/ui';
import { SITE } from './src/config';
import icon from "astro-icon";
import mdx from "@astrojs/mdx";
import { VitePWA } from "vite-plugin-pwa";
import AstroPWA from "@vite-pwa/astro"
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkToc from "remark-toc";
import rehypeSlug from 'rehype-slug';

const locales = languages;
const defaultLocale = defaultLang;


// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: cloudflare(),
  site: SITE.pagesDevUrl,
  trailingSlash: 'never',
  build: {
    format: 'file',
    inlineStylesheets: 'always',
  },
  markdown: {
    remarkPlugins: [remarkToc],
    rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'append' }]],
  },
  integrations: [
    solid(), 
    tailwind(), 
    icon({
      iconDir: "src/assets",
      include: {
        tabler: ["*"]
      }
    }), 
    i18n({
      locales,
      defaultLocale,
      exclude: ['pages/offline.astro', 'pages/fr/*', 'pages/es/*', 'pages/en/*'],
    }), 
    sitemap({
      i18n: {
        locales,
        defaultLocale,
        exclude: ['pages/offline.astro', 'pages/fr/*', 'pages/es/*', 'pages/en/*']
      },
      filter: defaultLocaleSitemapFilter({
        defaultLocale
      })
    }), 
    mdx(),
    // AstroPWA({
    //   registerType: 'autoUpdate',
    //   devOptions: {
    //     enabled: true
    //   },
    // })
  ],

//   vite: {
//     plugins: [
//       VitePWA({
//         devOptions: {
//           enabled: true,
//           type: 'module'
//         },
//         manifest: {
//           name: 'TodoServis',
//           short_name: 'TodoServis',
//           description: SITE.description,
//           theme_color: SITE.themeColor,
//           icons: [
//             { src: "/icon-192.png", type: "image/png", sizes: "192x192" },
//             { src: "/icon-512.png", type: "image/png", sizes: "512x512" },
//             { src: "/icon-512.png", type: "image/png", sizes: "512x512", purpose: "any maskable" }
//           ]
//         },
//         workbox: {
// 				  globDirectory: 'dist',
// 				  globPatterns: [
// 				    '**\/*.{js,css,html,svg,png,jpg,jpeg,gif,webp,woff,woff2,ttf,eot,ico}',
// 				  ],
//           navigateFallback: null,
//         },
//         useCredentials: true,
//       })
//     ]
//   //   define: {
//   //     'process.env.PUBLIC_VITE_SUPABASE_URL': JSON.stringify(process.env.PUBLIC_VITE_SUPABASE_URL),
//   //     'process.env.PUBLIC_VITE_SUPABASE_ANON_KEY': JSON.stringify(process.env.PUBLIC_VITE_SUPABASE_ANON_KEY),
//   //   }
//  },  
});