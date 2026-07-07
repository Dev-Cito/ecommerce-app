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
