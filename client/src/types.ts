export type Nutrition = { caloriesKcal: number; proteinG: number; carbsG: number; fatG: number; fiberG: number };
export type ProductOption = { name: string; choices: string[]; prices?: number[] };
export type Product = { id: string; category: string; name: string; description: string; price: number | null; availability?: boolean; nutrition?: Nutrition; options?: ProductOption[]; ambiguity?: string };
export type CartLine = { key: string; productId: string; quantity: number; options?: Record<string, string> };
