// Aggiunto dallo script setup.sh

import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /**
   * Abilitiamo CORS per permettere al frontend (Next.js)
   * di effettuare chiamate verso questo server.
   */
  app.enableCors();

  // Risponde ad /api
  app.setGlobalPrefix('api');

  /**
   * ValidationPipe permette di validare automaticamente i DTO
   * in ingresso usando i decoratori di class-validator.
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // Rimuove proprietà non definite
      forbidNonWhitelisted: true, // Lancia errore per proprietà extra
      transform: true,            // Trasforma tipi (string → number, etc.)
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Configurazione Swagger per la documentazione delle API
  const config = new DocumentBuilder()
    .setTitle('Gestione RecruitingTest : API Quiz')
    .setDescription('Documentazione interattiva delle API per il progetto "Gestione Quiz Logici"')
    .setVersion('1.0')
    .addTag('quiz')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Swagger sarà accessibile all'indirizzo http://localhost:3001/api/docs
  SwaggerModule.setup('api/docs', app, document);

  // Recuperiamo il ConfigService dal modulo
  const configService = app.get(ConfigService);

  // Leggiamo la variabile (con un fallback di sicurezza a 3001)
  const port = configService.get<number>('NESTJS_PORT') || 3001;
  await app.listen(port);

  console.log(`Server in esecuzione su: http://localhost:%d`, port);
  console.log(`Documentazione API: http://localhost:%d/api/docs`, port);
}

bootstrap();

// vim: set tabstop=2 shiftwidth=2 expandtab colorcolumn=121 :
