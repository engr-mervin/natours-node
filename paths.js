import path, { sep } from 'node:path';
import url from 'node:url';
export const __rootdirname = path.dirname(url.fileURLToPath(import.meta.url));
export const TOURS_SIMPLE = `${__rootdirname}${sep}dev-data${sep}data${sep}tours-simple.json`;
export const STATIC_FOLDER = `${__rootdirname}${sep}public`;
export const VIEW_FOLDER = `${__rootdirname}${sep}views`;
export const EMAIL_TEMPLATES = `${VIEW_FOLDER}/emails`;
