import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const LOCALHOST_ORIGIN = 'http://localhost:3001';

async function bootstrap() {
  // rawBody: true keeps the exact request bytes on req.rawBody (needed to verify
  // the Stripe webhook signature) while still parsing req.body as JSON everywhere else —
  // avoids the classic bodyParser-ordering foot-gun of hand-rolling this with express.raw().
  const app = await NestFactory.create(AppModule, { rawBody: true });

  const frontendUrl = process.env.FRONTEND_URL ?? LOCALHOST_ORIGIN;
  const allowedOrigins = Array.from(new Set([frontendUrl, LOCALHOST_ORIGIN]));
  // Never combine credentials with a wildcard origin — browsers reject it outright.
  app.enableCors({ origin: allowedOrigins, credentials: true });

  // Render (and most PaaS hosts) require binding to 0.0.0.0, not just a port.
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
void bootstrap();
