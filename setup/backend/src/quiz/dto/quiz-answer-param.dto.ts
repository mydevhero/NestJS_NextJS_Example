// Aggiunto dallo script setup.sh

import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class QuizAnswerParamDTO {
  @ApiProperty({
    description: 'ID dell\'utente che risponde',
    example: 1,
    minimum: 1,
    required: true
  })
  @IsInt()
  @Min(1)
  userId!: number;

  @ApiProperty({
    description: 'Indice della risposta selezionata (0-3)',
    example: 0,
    minimum: 0,
    maximum: 3,
    required: true
  })
  @IsInt()
  @Min(0)
  answer!: number;
}

// vim: set tabstop=2 shiftwidth=2 expandtab colorcolumn=121 :
