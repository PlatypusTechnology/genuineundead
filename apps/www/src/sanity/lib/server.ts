import { createClient } from 'next-sanity';

import { apiVersion, dataset, projectId, useCdn } from '../env';

export const server = () => {
    if (typeof window === 'object' )
        throw new Error('SERVICE API USED IN CLIENT');

    if(!process.env.SANITY_API_TOKEN) 
        throw new Error('MISSING SANITY_API_TOKEN environment variable');
    
    return createClient({
        apiVersion,
        dataset,
        projectId,
        useCdn,
        token: process.env.SANITY_API_TOKEN,
        perspective: 'published',
    })
}