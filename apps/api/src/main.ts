import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // rawBody: true keeps the exact request bytes on req.rawBody (needed to verify
  // the Stripe webhook signature) while still parsing req.body as JSON everywhere else —
  // avoids the classic bodyParser-ordering foot-gun of hand-rolling this with express.raw().
  const app = await NestFactory.create(AppModule, { rawBody: true });
  app.enableCors({ origin: process.env.FRONT_URL ?? 'http://localhost:3001' });
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
