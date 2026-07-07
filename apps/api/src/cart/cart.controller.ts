import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CartService, CartItemInput } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Post()
  create(@Body('items') items: CartItemInput[]) {
    return this.cartService.createCart(items);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.cartService.getCart(id);
  }
}
