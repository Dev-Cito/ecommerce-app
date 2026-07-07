export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  priceCents: number;
  currency: string;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  variants: ProductVariant[];
}
