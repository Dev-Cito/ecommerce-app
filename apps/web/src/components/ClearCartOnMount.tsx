"use client";

import { useEffect } from "react";
import { useCart } from "@/store/cart";

export function ClearCartOnMount() {
  const clear = useCart((state) => state.clear);

  useEffect(() => {
    clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
