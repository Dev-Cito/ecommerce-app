import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { CheckoutService } from './checkout.service';

@Controller('checkout')
export class CheckoutController {
  constructor(private checkout: CheckoutService) {}

  @Post('session')
  createSession(@Body('cartId') cartId: string) {
    if (!cartId) {
      throw new BadRequestException('cartId is required');
    }
    return this.checkout.createSession(cartId);
  }
}
