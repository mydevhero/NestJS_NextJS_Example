// Aggiunto dallo script setup.sh

import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';

@Module({
  controllers: [QuizController],
  providers: [QuizService],
  exports: [QuizService],
})

export class QuizModule {}

// vim: set tabstop=2 shiftwidth=2 expandtab colorcolumn=121 :
