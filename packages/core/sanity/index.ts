export * from './env';
export * from './lib/image';
export * from './schema';
import { client } from './lib/client';
import { server } from './lib/server';

export const serverSide = {
    server
}

export const clientSider = {
    client
}

