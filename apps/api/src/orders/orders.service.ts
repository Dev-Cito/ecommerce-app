import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryFailedError, Repository } from 'typeorm';
import Stripe from 'stripe';
import { Order, OrderStatus } from './order.entity';
import { OrderItem } from './order-item.entity';
import { Cart, CartStatus } from '../cart/cart.entity';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @InjectRepository(Order) private orders: Repository<Order>,
    private dataSource: DataSource,
  ) {}

  /**
   * Turns a paid checkout session into an Order. Stripe can deliver the same
   * webhook event more than once, so this must be a no-op on repeat calls —
   * guarded by an existence check, a cart-status check inside the
   * transaction, and the DB-level unique constraint as a last line of defense
   * against a race between two concurrent deliveries.
   */
  async fulfill(
    cartId: string,
    session: Stripe.Checkout.Session,
  ): Promise<Order | null> {
    const existing = await this.orders.findOne({
      where: { stripeSessionId: session.id },
    });
    if (existing) {
      this.logger.log(
        `Session ${session.id} already fulfilled as order ${existing.id}, skipping`,
      );
      return existing;
    }

    return this.dataSource.transaction(async (manager) => {
      const cart = await manager.findOne(Cart, {
        where: { id: cartId },
        relations: { items: { variant: { product: true } } },
      });

      if (!cart) {
        this.logger.error(
          `Webhook for session ${session.id} references unknown cart ${cartId}`,
        );
        return null;
      }

      if (cart.status !== CartStatus.OPEN) {
        this.logger.warn(
          `Cart ${cartId} is already ${cart.status}, ignoring duplicate webhook`,
        );
        return null;
      }

      const totalCents = cart.items.reduce(
        (sum, item) => sum + item.unitPriceCents * item.quantity,
        0,
      );

      const order = manager.create(Order, {
        cartId: cart.id,
        stripeSessionId: session.id,
        status: OrderStatus.PAID,
        totalCents,
        currency: cart.items[0]?.variant.currency ?? 'eur',
        items: cart.items.map((item) =>
          manager.create(OrderItem, {
            productName: item.variant.product.name,
            variantId: item.variant.id,
            unitPriceCents: item.unitPriceCents,
            quantity: item.quantity,
          }),
        ),
      });

      for (const item of cart.items) {
        item.variant.stock = Math.max(0, item.variant.stock - item.quantity);
        await manager.save(item.variant);
      }

      cart.status = CartStatus.CONVERTED;
      await manager.save(cart);

      try {
        return await manager.save(order);
      } catch (err) {
        const isUniqueViolation =
          err instanceof QueryFailedError &&
          (err.driverError as { code?: string }).code === '23505';
        if (isUniqueViolation) {
          this.logger.warn(
            `Duplicate webhook race for session ${session.id}, ignoring`,
          );
          return manager.findOne(Order, {
            where: { stripeSessionId: session.id },
          });
        }
        throw err;
      }
    });
  }

  /**
   * Marks an abandoned checkout's cart as expired. Only touches carts still
   * OPEN — if the cart was already converted (payment succeeded in a race
   * with this event) or already expired (duplicate webhook), this is a no-op.
   */
  async expireCart(cartId: string): Promise<void> {
    const carts = this.dataSource.getRepository(Cart);
    const cart = await carts.findOne({ where: { id: cartId } });

    if (!cart) {
      this.logger.warn(
        `Webhook for expired session references unknown cart ${cartId}`,
      );
      return;
    }

    if (cart.status !== CartStatus.OPEN) {
      this.logger.log(
        `Cart ${cartId} is already ${cart.status}, ignoring expiry webhook`,
      );
      return;
    }

    cart.status = CartStatus.EXPIRED;
    await carts.save(cart);
    this.logger.log(
      `Cart ${cartId} marked expired (checkout session abandoned)`,
    );
  }
}
