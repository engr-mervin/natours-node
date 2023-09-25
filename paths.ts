import path, { sep } from 'node:path';
import url from 'node:url';

export const __rootdirname = path.dirname(url.fileURLToPath(import.meta.url));

export const TOURS_SIMPLE: string = `${__rootdirname}${sep}dev-data${sep}data${sep}tours-simple.json`;

export const STATIC_FOLDER: string = `${__rootdirname}${sep}public`;
