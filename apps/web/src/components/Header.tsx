"use client";

import Link from "next/link";
import { useCart, cartTotalItems } from "@/store/cart";

export function Header() {
  const items = useCart((state) => state.items);
  const count = cartTotalItems(items);

  return (
    <header className="flex items-center justify-between border-b border-black/10 px-6 py-4 dark:border-white/10">
      <Link href="/" className="font-semibold tracking-tight">
        ecommerce-app
      </Link>
      <Link href="/cart" className="relative text-sm font-medium">
        Cart
        {count > 0 && (
          <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground px-1.5 text-xs text-background">
            {count}
          </span>
        )}
      </Link>
    </header>
  );
}
