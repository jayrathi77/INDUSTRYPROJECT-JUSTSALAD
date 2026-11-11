import data from './menu.json' with { type: 'json' };
export type MenuItem = (typeof data)[number];
export const menu = data as MenuItem[];
export const categories = [...new Set(menu.map((item) => item.category))];
