import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  public readonly client: Stripe;

  constructor(private config: ConfigService) {
    this.client = new Stripe(
      this.config.getOrThrow<string>('STRIPE_SECRET_KEY'),
      {
        apiVersion: '2026-06-24.dahlia', // pinned to the version shipped with the installed `stripe` package
      },
    );
  }
}
