// Aggiunto dallo script setup.sh

import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDTO {
  @ApiProperty({ example: 1, description: 'ID univoco dell\'utente' })
  id!: number;

  @ApiProperty({ example: 'alice@example.com', description: 'Email dell\'utente' })
  email!: string;

  @ApiProperty({ example: 'Alice', description: 'Nickname dell\'utente' })
  nickname!: string;
}

/**
 * DTO per documentare gli errori (KO) in Swagger
 */
export class LoginErrorResponseDTO {
  @ApiProperty({ example: 401, description: 'Codice di stato HTTP' })
  statusCode!: number;

  @ApiProperty({ example: 'Utente non trovato', description: 'Messaggio di errore' })
  message!: string;

  @ApiProperty({ example: 'Unauthorized', description: 'Tipo di errore' })
  error!: string;
}

// vim: set tabstop=2 shiftwidth=2 expandtab colorcolumn=121 :
