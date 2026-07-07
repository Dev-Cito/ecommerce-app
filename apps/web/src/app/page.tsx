import { API_URL } from "@/lib/api";
import { ProductList } from "@/components/ProductList";
import type { Product } from "@/lib/types";

async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${API_URL}/products`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Products</h1>
      {products.length === 0 ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          No products yet — run <code>pnpm seed</code> in apps/api.
        </p>
      ) : (
        <ProductList products={products} />
      )}
    </main>
  );
}
