import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-05-15',
    devtools: { enabled: true },

    app: {
        baseURL: '/',
    },

    build: {
        transpile: ['vuetify'],
    },

    css: ['gridstack/dist/gridstack.min.css'],

    modules: [
        '@pinia/nuxt',
        (_options, nuxt) => {
            nuxt.hooks.hook('vite:extendConfig', (config) => {
                // @ts-expect-error: config.plugins is not defined
                config.plugins.push(vuetify({ autoImport: true }));
            });
        },
        '@nuxt/eslint',
        '@nuxt/fonts',
        '@nuxt/icon',
        '@nuxt/image',
        '@nuxt/scripts',
        '@nuxt/test-utils',
    ],

    vite: {
        vue: {
            template: {
                transformAssetUrls,
            },
        },
    }
});
