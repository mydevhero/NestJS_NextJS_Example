// Aggiunto dallo script setup.sh

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { prisma } from '../../lib/prisma';

// Import dei DTO di RISPOSTA (non di richiesta per il service)
import { QuizListResponseDTO } from './dto/quiz-list-response.dto';
import { QuizDetailResponseDTO } from './dto/quiz-detail-response.dto';
import { QuizAnswerResponseDTO } from './dto/quiz-answer-response.dto';
import { LeaderboardResponseDTO } from './dto/quiz-leaderboard-response.dto';

// Import del DTO di richiesta
import { QuizAnswerParamDTO } from './dto/quiz-answer-param.dto';

@Injectable()
export class QuizService {
  /**
   * Recupera tutti i quiz per l'area privata (CSR).
   * Include un flag per sapere se l'utente ha già risposto.
   */
  async findAll(userId?: number): Promise<QuizListResponseDTO[]> {
    const quizzes = await prisma.quiz.findMany({
      include: {
        answers: userId ? { where: { userId } } : false,
      },
    });

    return quizzes.map((q): QuizListResponseDTO => {
      const answer = q.answers?.[0]; // Recuperiamo la risposta se esiste

      return {
        id: q.id,
        question: q.question,
        options: q.options,
        completed: !!answer,
        // Aggiungiamo i dettagli della selezione se l'utente ha risposto
        userSelection: answer
          ? {
              selectedOption: answer.selectedOption ?? 0,
              isCorrect: answer.isCorrect,
            }
          : undefined,
        // Mandiamo la spiegazione solo se ha già risposto
        explanation: answer ? q.explanation : undefined,
      };
    });
  }
  // async findAll(userId?: number): Promise<QuizListResponseDTO[]> {
  //   const quizzes = await prisma.quiz.findMany({
  //     include: {
  //       answers: userId ? { where: { userId } } : false,
  //     },
  //   });
  //
  //   return quizzes.map((q): QuizListResponseDTO => ({
  //     id: q.id,
  //     question: q.question,
  //     options: q.options,
  //     completed: q.answers?.length > 0,
  //   }));
  // }

  /**
   * Recupera il dettaglio di un quiz per l'area pubblica (SSR).
   * Calcola la percentuale di successo in tempo reale.
   */
  async getPublicDetail(id: number): Promise<QuizDetailResponseDTO> {
    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: { _count: { select: { answers: true } } },
    });

    if (!quiz) throw new NotFoundException('Quiz non trovato');

    const correctAnswers = await prisma.answer.count({
      where: { quizId: id, isCorrect: true },
    });

    const totalAnswers = quiz._count.answers;
    const successRate =
      totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;

    return {
      question: quiz.question,
      explanation: quiz.explanation,
      successRate: `${successRate}%`,
    };
  }

  /**
   * Registra la risposta di un utente.
   */
  async submitAnswer(
    quizId: number,
    dto: QuizAnswerParamDTO,
  ): Promise<QuizAnswerResponseDTO> {
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
    });

    if (!quiz) throw new NotFoundException('Quiz non trovato');

    // Validazione indice risposta
    if (dto.answer < 0 || dto.answer >= quiz.options.length) {
      throw new BadRequestException('Indice risposta non valido');
    }

    // Controllo risposta già data
    const existing = await prisma.answer.findUnique({
      where: { userId_quizId: { userId: dto.userId, quizId } },
    });

    if (existing) {
      throw new BadRequestException('Hai già risposto a questo quiz');
    }

    // Determina se la risposta è corretta
    const isCorrect = quiz.correctAnswer === dto.answer;

    // Crea la risposta e ritorna i dati CREATI (non del quiz!)
    const answer = await prisma.answer.create({
      data: {
        userId: dto.userId,
        quizId: quizId,
        isCorrect: isCorrect,
        selectedOption: dto.answer,
      },
    });
    // const answer = await prisma.answer.create({
    //   data: {
    //     userId: dto.userId,
    //     quizId: quizId,
    //     isCorrect: isCorrect,
    //   },
    // });

    // Ritorna i dati della RISPOSTA creata
    return {
      id: answer.id, // ID della risposta
      userId: answer.userId, // Chi ha risposto
      quizId: answer.quizId, // A quale quiz
      isCorrect: answer.isCorrect, // Se è corretta
      createdAt: answer.createdAt, // Quando
      explanation: quiz.explanation, // La spiegazione!
    };
  }

  /**
   * Genera la classifica pubblica.
   */
  // backend/src/quiz/quiz.service.ts
  async getLeaderboard(): Promise<LeaderboardResponseDTO[]> {
    const users = await prisma.user.findMany({
      select: {
        nickname: true,
        _count: {
          select: {
            // Contiamo solo le risposte corrette
            answers: { where: { isCorrect: true } },
          },
        },
      },
      orderBy: {
        answers: { _count: 'desc' },
      },
      take: 10,
    });

    // Qui mappiamo esattamente come vuole il tuo DTO
    return users.map((user) => ({
      nickname: user.nickname,
      _count: {
        answers: user._count.answers,
      },
    }));
  }
  // async getLeaderboard(): Promise<LeaderboardResponseDTO[]> {
  //   const users = await prisma.user.findMany({
  //     select: {
  //       nickname: true,
  //       _count: {
  //         select: {
  //           answers: { where: { isCorrect: true } }
  //         },
  //       },
  //     },
  //     orderBy: {
  //       answers: { _count: 'desc' },
  //     },
  //     take: 10,
  //   });
  //
  //   return users.map(user => ({
  //     nickname: user.nickname,
  //     score: user._count.answers, // Mappiamo il conteggio su 'score'
  //   }));
  // }
  // async getLeaderboard(): Promise<LeaderboardResponseDTO[]> {
  //   const users = await prisma.user.findMany({
  //     select: {
  //       nickname: true,
  //       _count: {
  //         select: { answers: { where: { isCorrect: true } } },
  //       },
  //     },
  //     orderBy: {
  //       answers: { _count: 'desc' },
  //     },
  //     take: 10,
  //   });
  //
  //   return users.map((user): LeaderboardResponseDTO => ({
  //     nickname: user.nickname,
  //     _count: {
  //       answers: user._count.answers,
  //     },
  //   }));
  // }
}

// vim: set tabstop=2 shiftwidth=2 expandtab colorcolumn=121 :
