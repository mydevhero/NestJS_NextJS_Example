// Aggiunto dallo script setup.sh

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
  HttpStatus
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  // ApiQuery,
  ApiParam,
  ApiBody,
  ApiResponse,
  ApiOkResponse,
  ApiCreatedResponse
} from '@nestjs/swagger';
import { QuizService } from './quiz.service';


// GET/quiz
// GET/quiz?userId=
import { QuizListParamDTO      } from './dto/quiz-list-param.dto';
import { QuizListResponseDTO   } from './dto/quiz-list-response.dto';

// GET/quiz/leaderboard
import { LeaderboardResponseDTO} from './dto/quiz-leaderboard-response.dto';

// GET/quiz/{id}/public
import { QuizDetailParamDTO    } from './dto/quiz-detail-param.dto';
import { QuizDetailResponseDTO } from './dto/quiz-detail-response.dto';

// POST/quiz/{id}/answer
import { QuizAnswerParamDTO    } from './dto/quiz-answer-param.dto';
import { QuizAnswerResponseDTO } from './dto/quiz-answer-response.dto';


@ApiTags('quiz')
@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}



  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // GET/quiz
  // GET/quiz?userId=1
  @Get()
  @ApiOperation({
    summary: 'Lista di tutti i quiz',
    description: 'Restituisce tutti i quiz. Opzionalmente filtra per vedere quali quiz un utente ha completato.'
  })
  @ApiOkResponse({
    description: 'Lista di quiz restituita con successo',
    type: [QuizListResponseDTO]
  })
  findAll(@Query() query: QuizListParamDTO) {
    return this.quizService.findAll(query.userId);
  }
  // ---------------------------------------------------------------------------



  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // GET/quiz/leaderboard
  @Get('leaderboard')
  @ApiOperation({
    summary: 'Classifica pubblica',
    description: 'Restituisce la top 10 degli utenti con più risposte corrette'
  })
  @ApiOkResponse({
    description: 'Classifica restituita con successo',
    type: [LeaderboardResponseDTO]
  })
  getLeaderboard() {
    return this.quizService.getLeaderboard();
  }
  // ---------------------------------------------------------------------------



  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // GET/quiz/{id}/public
  @Get(':id/public')
  @ApiOperation({
    summary: 'Dettaglio pubblico del quiz',
    description: 'Informazioni pubbliche sul quiz, inclusa la percentuale di successo'
  })
  @ApiOkResponse({
    description: 'Dettaglio quiz restituito',
    type: QuizDetailResponseDTO
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Quiz non trovato'
  })
  getPublicDetail(@Param() params: QuizDetailParamDTO) {
    return this.quizService.getPublicDetail(params.id);
  }
  // ---------------------------------------------------------------------------



  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // POST/quiz/{id}/answer
  @Post(':id/answer')
  @ApiOperation({
    summary: 'Invia una risposta al quiz',
    description: 'Registra la risposta di un utente a un quiz. Ritorna i dettagli della risposta creata.'
  })
  @ApiParam({
    name: 'id',
    description: 'ID del quiz',
    type: Number,
    example: 1,
    required: true
  })
  @ApiBody({
    type: QuizAnswerParamDTO,
    description: 'Dati della risposta'
  })
  @ApiCreatedResponse({
    description: 'Risposta registrata con successo',
    type: QuizAnswerResponseDTO
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dati non validi o utente ha già risposto'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Quiz non trovato'
  })
  submitAnswer(
  @Param('id', ParseIntPipe) id: number,
  @Body() dto: QuizAnswerParamDTO
  ) {
    return this.quizService.submitAnswer(id, dto);
  }
  // ---------------------------------------------------------------------------
}

// vim: set tabstop=2 shiftwidth=2 expandtab colorcolumn=121 :
