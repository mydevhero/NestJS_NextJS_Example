// Aggiunto dallo script setup.sh

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class QuizListResponseDTO {
  @ApiProperty({
    description: 'ID del quiz',
    example: 1
  })
  id!: number;

  @ApiProperty({
    description: 'Domanda del quiz',
    example: 'Quanto fa 2+2?'
  })
  question!: string;

  @ApiProperty({
    description: 'Opzioni di risposta',
    example: ['3', '4', '5', '6'],
    type: [String]
  })
  options!: string[];

  @ApiProperty({
    description: 'Indica se l\'utente ha già risposto a questo quiz',
    example: false
  })
  completed!: boolean;

  @ApiPropertyOptional({
    description: 'Dettagli della risposta data dall\'utente'
  })
  userSelection?: {
    selectedOption: number;
    isCorrect: boolean;
  };

  @ApiProperty({ description: 'Spiegazione del quiz (mostrata solo se completato)' })
  explanation?: string;
}

// vim: set tabstop=2 shiftwidth=2 expandtab colorcolumn=121 :
