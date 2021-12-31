import { visualizer } from 'rollup-plugin-visualizer';
import preprocess from 'svelte-preprocess';
import vercel from '@sveltejs/adapter-vercel';
import path from 'path';

export default {
    kit: {
        adapter: vercel(),

        vite: {
            server: {
                port: 5000,
            },

            resolve: {
                alias: [
                    {
                        find: '$sanity',
                        replacement: path.resolve('./src/sanity.js'),
                    },
                ],
            },

            plugins: [visualizer()],
        },
    },

    preprocess: preprocess(),
};