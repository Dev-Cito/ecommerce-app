import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Cart } from './cart.entity';
import { ProductVariant } from '../products/product-variant.entity';

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
  cart: Cart;

  @ManyToOne(() => ProductVariant)
  variant: ProductVariant;

  @Column('int')
  quantity: number;

  @Column('int')
  unitPriceCents: number;
}
