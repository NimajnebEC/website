import client from '@sanity/client';

export const sanity = client({
    projectId: 'x362b5r1',
    dataset: import.meta.env.MODE == 'development' ? 'testing' : 'blog',
    apiVersion: '2021-03-25',
    useCdn: true,
});