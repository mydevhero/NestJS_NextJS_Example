// Aggiunto dallo script setup.sh

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { QuizModule } from '../src/quiz/quiz.module';
import { prisma } from '../lib/prisma';

describe('QuizModule Integration', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [QuizModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  it('/quiz (GET) should return 200', () => {
    return request(app.getHttpServer())
      .get('/quiz')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });

  it('/quiz/leaderboard (GET) should return 200', () => {
    return request(app.getHttpServer())
      .get('/quiz/leaderboard')
      .expect(200);
  });
});

// vim: set tabstop=2 shiftwidth=2 expandtab colorcolumn=121 :
