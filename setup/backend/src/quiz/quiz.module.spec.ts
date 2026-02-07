// Aggiunto dallo script setup.sh

import { Test } from '@nestjs/testing';
import { QuizModule } from './quiz.module';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';

describe('QuizModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [QuizModule],
    }).compile();

    expect(module).toBeDefined();
  });

  it('should provide QuizController', async () => {
    const module = await Test.createTestingModule({
      imports: [QuizModule],
    }).compile();

    const controller = module.get(QuizController);
    expect(controller).toBeInstanceOf(QuizController);
  });

  it('should provide QuizService', async () => {
    const module = await Test.createTestingModule({
      imports: [QuizModule],
    }).compile();

    const service = module.get(QuizService);
    expect(service).toBeInstanceOf(QuizService);
  });
});

// vim: set tabstop=2 shiftwidth=2 expandtab colorcolumn=121 :
