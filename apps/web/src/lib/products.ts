import {
  Shirt,
  ShoppingBag,
  Coffee,
  Package,
  Headphones,
  Keyboard,
  Mouse,
  Backpack,
  Lamp,
  Cable,
  type LucideIcon,
} from "lucide-react";

export const eur = (cents: number) =>
  (cents / 100).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface Presentation {
  icon: LucideIcon;
  blurb: string;
}

const PRESENTATION: Record<string, Presentation> = {
  "classic-t-shirt": { icon: Shirt, blurb: "Soft cotton, everyday cut" },
  "canvas-tote-bag": { icon: ShoppingBag, blurb: "Heavy-duty carry-all" },
  "ceramic-mug": { icon: Coffee, blurb: "350ml, dishwasher safe" },
  "wireless-headphones": { icon: Headphones, blurb: "Active noise-cancelling" },
  "mechanical-keyboard": { icon: Keyboard, blurb: "Hot-swappable switches" },
  "wireless-mouse": { icon: Mouse, blurb: "Ergonomic, low-latency" },
  "everyday-backpack": { icon: Backpack, blurb: "Weatherproof, padded laptop sleeve" },
  "desk-lamp": { icon: Lamp, blurb: "Dimmable LED" },
  // slugify("Braided USB-C Cable") -> "braided-usb-c-cable", not "braided-usbc-cable" —
  // the existing slugify() splits on every non-alphanumeric run, so the hyphen in "USB-C" survives.
  "braided-usb-c-cable": { icon: Cable, blurb: "Reinforced braided cable" },
};

const FALLBACK: Presentation = { icon: Package, blurb: "" };

export function presentationFor(productName: string): Presentation {
  return PRESENTATION[slugify(productName)] ?? FALLBACK;
}
