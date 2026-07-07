import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './cart.entity';
import { CartItem } from './cart-item.entity';
import { ProductVariant } from '../products/product-variant.entity';

export interface CartItemInput {
  variantId: string;
  quantity: number;
}

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private carts: Repository<Cart>,
    @InjectRepository(ProductVariant)
    private variants: Repository<ProductVariant>,
  ) {}

  async createCart(items: CartItemInput[]): Promise<Cart> {
    if (!items?.length) {
      throw new BadRequestException('Cart must contain at least one item');
    }

    const cartItems: CartItem[] = [];
    for (const { variantId, quantity } of items) {
      if (!quantity || quantity < 1) {
        throw new BadRequestException(
          `Invalid quantity for variant ${variantId}`,
        );
      }
      const variant = await this.variants.findOne({
        where: { id: variantId },
        relations: { product: true },
      });
      if (!variant) {
        throw new BadRequestException(`Unknown product variant ${variantId}`);
      }
      const cartItem = new CartItem();
      cartItem.variant = variant;
      cartItem.quantity = quantity;
      cartItem.unitPriceCents = variant.priceCents;
      cartItems.push(cartItem);
    }

    const cart = this.carts.create({ items: cartItems });
    return this.carts.save(cart);
  }

  async getCart(id: string): Promise<Cart> {
    const cart = await this.carts.findOne({
      where: { id },
      relations: { items: { variant: { product: true } } },
    });
    if (!cart) {
      throw new NotFoundException(`Cart ${id} not found`);
    }
    return cart;
  }
}
