import { NestFactory } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppModule } from './app.module';
import { Product } from './products/product.entity';
import { ProductVariant } from './products/product-variant.entity';

const CATALOG = [
  {
    name: 'Classic T-Shirt',
    description: 'Cotton t-shirt',
    variants: [
      { name: 'S / Black', sku: 'TS-S-BLK', priceCents: 1990, stock: 50 },
      { name: 'M / Black', sku: 'TS-M-BLK', priceCents: 1990, stock: 50 },
      { name: 'L / Black', sku: 'TS-L-BLK', priceCents: 1990, stock: 50 },
    ],
  },
  {
    name: 'Canvas Tote Bag',
    description: 'Durable canvas tote',
    variants: [
      { name: 'One Size', sku: 'TOTE-OS', priceCents: 1490, stock: 100 },
    ],
  },
  {
    name: 'Ceramic Mug',
    description: '350ml ceramic mug',
    variants: [
      { name: 'White', sku: 'MUG-WHT', priceCents: 990, stock: 200 },
      { name: 'Black', sku: 'MUG-BLK', priceCents: 990, stock: 200 },
    ],
  },
  {
    name: 'Zip Hoodie',
    description: 'Heavyweight zip hoodie',
    variants: [
      { name: 'S / Black', sku: 'HOOD-S-BLK', priceCents: 4990, stock: 50 },
      { name: 'M / Black', sku: 'HOOD-M-BLK', priceCents: 4990, stock: 50 },
      { name: 'L / Black', sku: 'HOOD-L-BLK', priceCents: 4990, stock: 50 },
    ],
  },
  {
    name: 'Snapback Cap',
    description: 'Structured 6-panel snapback',
    variants: [
      { name: 'One Size', sku: 'CAP-OS', priceCents: 2490, stock: 50 },
    ],
  },
  {
    name: 'Sticker Pack',
    description: 'Die-cut vinyl stickers',
    variants: [
      { name: 'Pack of 10', sku: 'STK-10PK', priceCents: 690, stock: 50 },
    ],
  },
  {
    name: 'Enamel Water Bottle',
    description: '500ml enamel-coated steel bottle',
    variants: [
      {
        name: '500ml / Violet',
        sku: 'BOTTLE-500-VIO',
        priceCents: 1990,
        stock: 50,
      },
      {
        name: '500ml / Cyan',
        sku: 'BOTTLE-500-CYA',
        priceCents: 1990,
        stock: 50,
      },
    ],
  },
  {
    name: 'Desk Mat',
    description: 'Stitched-edge desk mat',
    variants: [
      { name: 'Medium', sku: 'DESKMAT-M', priceCents: 2990, stock: 50 },
      { name: 'XL', sku: 'DESKMAT-XL', priceCents: 3490, stock: 50 },
    ],
  },
  {
    name: 'Laptop Sleeve',
    description: 'Padded neoprene laptop sleeve',
    variants: [
      { name: '13"', sku: 'SLEEVE-13', priceCents: 3290, stock: 50 },
      { name: '15"', sku: 'SLEEVE-15', priceCents: 3290, stock: 50 },
    ],
  },
  {
    name: 'Wireless Headphones',
    description: 'Active noise-cancelling headphones',
    variants: [
      { name: 'Violet', sku: 'HEADPH-VIO', priceCents: 5990, stock: 50 },
      { name: 'Cyan', sku: 'HEADPH-CYA', priceCents: 5990, stock: 50 },
    ],
  },
  {
    name: 'Mechanical Keyboard',
    description: 'Hot-swappable mechanical keyboard',
    variants: [
      { name: 'Brown switch', sku: 'KB-BROWN', priceCents: 8990, stock: 50 },
      { name: 'Red switch', sku: 'KB-RED', priceCents: 8990, stock: 50 },
    ],
  },
  {
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse',
    variants: [
      { name: 'One Size', sku: 'MOUSE-OS', priceCents: 3490, stock: 50 },
    ],
  },
  {
    name: 'Everyday Backpack',
    description: 'Weatherproof everyday backpack',
    variants: [
      { name: 'Black', sku: 'BKPK-BLK', priceCents: 6490, stock: 50 },
      { name: 'Navy', sku: 'BKPK-NVY', priceCents: 6490, stock: 50 },
    ],
  },
  {
    name: 'Desk Lamp',
    description: 'Dimmable LED desk lamp',
    variants: [
      { name: 'White', sku: 'LAMP-WHT', priceCents: 4290, stock: 50 },
      { name: 'Black', sku: 'LAMP-BLK', priceCents: 4290, stock: 50 },
    ],
  },
  {
    name: 'Braided USB-C Cable',
    description: 'Braided USB-C charging cable',
    variants: [
      { name: '1m', sku: 'CABLE-1M', priceCents: 1290, stock: 50 },
      { name: '2m', sku: 'CABLE-2M', priceCents: 1490, stock: 50 },
    ],
  },
];

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const products: Repository<Product> = app.get(getRepositoryToken(Product));
  const variants: Repository<ProductVariant> = app.get(
    getRepositoryToken(ProductVariant),
  );

  const existing = await products.count();
  if (existing > 0) {
    console.log(`Already seeded (${existing} products found) — skipping.`);
    await app.close();
    return;
  }

  for (const item of CATALOG) {
    const product = await products.save(
      products.create({ name: item.name, description: item.description }),
    );
    for (const variant of item.variants) {
      await variants.save(
        variants.create({ ...variant, currency: 'eur', product }),
      );
    }
  }

  console.log(`Seeded ${CATALOG.length} products.`);
  await app.close();
}

void seed();
