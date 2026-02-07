// Aggiunto dallo script setup.sh

import { ApiProperty } from '@nestjs/swagger';

// Tipo per le statistiche
export class UserStatsDTO {
  @ApiProperty({
    description: 'Numero totale di risposte date',
    example: 5
  })
  answers: number = 0;
}

export class LeaderboardResponseDTO {
  @ApiProperty({
    description: 'Nickname dell\'utente',
    example: 'alice123'
  })
  nickname!: string;

  @ApiProperty({
    description: 'Statistiche dell\'utente',
    type: UserStatsDTO,
    example: { answers: 5 }
  })
  _count!: UserStatsDTO;
}

// vim: set tabstop=2 shiftwidth=2 expandtab colorcolumn=121 :
