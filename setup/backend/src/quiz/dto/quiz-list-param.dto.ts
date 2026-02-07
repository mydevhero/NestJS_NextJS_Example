// Aggiunto dallo script setup.sh

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class QuizListParamDTO {
  @ApiPropertyOptional({
    description: 'ID dell\'utente per vedere quali quiz ha completato',
    example: 1,
    type: Number
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  userId?: number;
}

// vim: set tabstop=2 shiftwidth=2 expandtab colorcolumn=121 :
