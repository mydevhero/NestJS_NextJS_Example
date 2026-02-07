// Aggiunto dallo script setup.sh

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginRequestDTO {
  @ApiProperty({
    example: 'Alice',
    description: 'Il nickname univoco dell\'utente'
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  nickname: string = '';
}

// vim: set tabstop=2 shiftwidth=2 expandtab colorcolumn=121 :
