import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class ProductVariant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product, (product) => product.variants, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @Column()
  name: string;

  @Column({ unique: true })
  sku: string;

  @Column('int')
  priceCents: number;

  @Column({ default: 'eur' })
  currency: string;

  @Column('int', { default: 0 })
  stock: number;
}
