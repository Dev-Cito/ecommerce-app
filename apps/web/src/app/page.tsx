import { API_URL } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import { ContainerScroll } from "@/components/ContainerScroll";
import { PanelVisual } from "@/components/PanelVisual";
import { Navbar, HeroTitle, AmbientBlobs } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import type { Product } from "@/lib/types";

async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${API_URL}/products`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <main className="relative min-h-screen overflow-hidden bg-ink text-cloud">
      <AmbientBlobs />
      <Navbar />
      <ContainerScroll titleComponent={<HeroTitle />}>
        <PanelVisual />
      </ContainerScroll>
      <section className="mx-auto max-w-[1120px] px-6 pb-[100px] pt-5">
        {products.length === 0 ? (
          <p className="text-sm text-muted">
            No products yet — run <code className="font-mono">pnpm seed</code> in apps/api.
          </p>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-[22px]">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </section>
      <Footer />
    </main>
  );
}
