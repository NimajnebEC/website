import { format } from 'date-fns';
import { marked } from 'marked';
import { sanity } from '$lib/sanity';
import Prism from 'prismjs';
import groq from 'groq';
import 'prism-svelte';

marked.setOptions({
    highlight: (code, lang) => {
        try {
            const result = Prism.highlight(code, Prism.languages[lang], lang);
            return result;
        } catch {
            console.error(`Unable to highlight lang: ${lang} code: ${code}`);
        }

        return code;
    },
});

/** @type {import('@sveltejs/kit').RequestHandler} */
export const get = async ({ params }) => {
    const { slug } = params;

    const sanityQuery = groq`
        *[_type == 'post' && slug.current == $slug][0] {
            title,
            timestamp,
            body,
            postType,
            link,
            excerpt,
            
            "image": image.asset -> url,

            "tag": tag -> {
                name,
                "rgb": colour.rgb { r, g, b }
            }
        }
    `;

    const post = await sanity.fetch(sanityQuery, { slug });

    if (!post)
        return {
            status: 404,
        };

    if (post.body && post.postType == 'text') {
        post.body = marked(post.body);
    }

    return {
        body: {
            ...post,
            timestamp: format(new Date(post.timestamp), 'do LLLL yyyy'),
        },
    };
};
