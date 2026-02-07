// Aggiunto dallo script setup.sh

import { Test, TestingModule } from '@nestjs/testing';
import { QuizService } from './quiz.service';
import { prisma } from '../../lib/prisma';
import { NotFoundException, BadRequestException } from '@nestjs/common';

import { QuizAnswerParamDTO     } from './dto/quiz-answer-param.dto';
import { QuizListResponseDTO    } from './dto/quiz-list-response.dto';
import { QuizDetailResponseDTO  } from './dto/quiz-detail-response.dto';
import { QuizAnswerResponseDTO  } from './dto/quiz-answer-response.dto';
import { LeaderboardResponseDTO } from './dto/quiz-leaderboard-response.dto';

describe('QuizService (Database Reale)', () => {
  let service: QuizService;

  // Dati di riferimento dal seed
  let existingUserId: number;
  let existingQuizId: number;

  beforeAll(async () => {
    // Recupera dati esistenti dal database
    const existingUser = await prisma.user.findFirst();
    if (!existingUser) {
      throw new Error('Nessun utente nel database. Esegui prima il seed.');
    }
    existingUserId = existingUser.id;

    const existingQuiz = await prisma.quiz.findFirst();
    if (!existingQuiz) {
      throw new Error('Nessun quiz nel database. Esegui prima il seed.');
    }
    existingQuizId = existingQuiz.id;

    // Configura il service
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuizService],
    }).compile();

    service = module.get<QuizService>(QuizService);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Pulisci tutte le risposte PRIMA di ogni test group
    await prisma.answer.deleteMany({
      where: {
        OR: [
          { userId: existingUserId },
          { quizId: existingQuizId }
        ]
      },
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll()', () => {
    it('should return all quizzes from database with correct DTO structure', async () => {
      const result = await service.findAll();

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);

      // Verifica che sia un array di QuizListResponseDTO
      const firstQuiz = result[0] as QuizListResponseDTO;
      expect(firstQuiz).toHaveProperty('id');
      expect(firstQuiz).toHaveProperty('question');
      expect(firstQuiz).toHaveProperty('options');
      expect(Array.isArray(firstQuiz.options)).toBe(true);
      expect(firstQuiz).toHaveProperty('completed');
      expect(typeof firstQuiz.completed).toBe('boolean');
    });

    it('should show completed quizzes when userId is provided', async () => {
      // Prima rispondi a un quiz
      const answerDto: QuizAnswerParamDTO = {
        userId: existingUserId,
        answer: 0,
      };

      await service.submitAnswer(existingQuizId, answerDto);

      // Verifica che il quiz appaia come completato
      const result = await service.findAll(existingUserId);

      const completedQuiz = result.find(q => q.id === existingQuizId);
      expect(completedQuiz).toBeDefined();
      expect(completedQuiz?.completed).toBe(true);
    });

    it('should not show completed flag when no userId provided', async () => {
      const result = await service.findAll();

      // Tutti i quiz dovrebbero avere completed: false se nessun userId
      result.forEach(quiz => {
        expect(quiz.completed).toBe(false);
      });
    });
  });

  describe('getPublicDetail()', () => {
    it('should return public quiz details with correct DTO structure', async () => {
      const result = await service.getPublicDetail(existingQuizId);

      // Verifica che sia un QuizDetailResponseDTO
      expect(result).toHaveProperty('question');
      expect(typeof result.question).toBe('string');
      expect(result).toHaveProperty('explanation');
      expect(typeof result.explanation).toBe('string');
      expect(result).toHaveProperty('successRate');
      expect(result.successRate).toMatch(/\d+%/); // Formato "XX%"
    });

    it('should throw NotFoundException for non-existent quiz', async () => {
      const nonExistentId = 999999;

      await expect(service.getPublicDetail(nonExistentId))
        .rejects
        .toThrow(NotFoundException);
    });
  });

  describe('submitAnswer()', () => {
    beforeEach(async () => {
      // Pulisci specificamente per questi test
      await prisma.answer.deleteMany({
        where: {
          userId: existingUserId,
          quizId: existingQuizId,
        },
      });
    });

    it('should create a new answer and return QuizAnswerResponseDTO', async () => {
      const answerDto: QuizAnswerParamDTO = {
        userId: existingUserId,
        answer: 0,
      };

      const result = await service.submitAnswer(existingQuizId, answerDto);

      // Verifica che sia la RISPOSTA, non il quiz
      expect(result).toHaveProperty('id');           // ID risposta
      expect(result).toHaveProperty('userId');       // Chi ha risposto
      expect(result.userId).toBe(existingUserId);
      expect(result).toHaveProperty('quizId');       // A quale quiz
      expect(result.quizId).toBe(existingQuizId);
      expect(result).toHaveProperty('isCorrect');    // Se è corretta
      expect(typeof result.isCorrect).toBe('boolean');
      expect(result).toHaveProperty('createdAt');    // Quando
      expect(result.createdAt).toBeInstanceOf(Date);
    });

    it('should mark answer as correct when matching quiz correctAnswer', async () => {
      // Ottieni il quiz per sapere la risposta corretta
      const quiz = await prisma.quiz.findUnique({
        where: { id: existingQuizId },
      });

      const answerDto: QuizAnswerParamDTO = {
        userId: existingUserId,
        answer: quiz!.correctAnswer,
      };

      const result = await service.submitAnswer(existingQuizId, answerDto);

      // Verifica che la risposta sia stata registrata nel DB
      const dbAnswer = await prisma.answer.findUnique({
        where: { userId_quizId: { userId: existingUserId, quizId: existingQuizId } },
      });

      expect(dbAnswer).toBeDefined();
      expect(dbAnswer?.isCorrect).toBe(true);
    });

    it('should throw BadRequestException for invalid answer index', async () => {
      const answerDto: QuizAnswerParamDTO = {
        userId: existingUserId,
        answer: 999, // Indice non valido
      };

      await expect(service.submitAnswer(existingQuizId, answerDto))
        .rejects
        .toThrow(BadRequestException);
    });

    it('should throw BadRequestException when user already answered', async () => {
      const answerDto: QuizAnswerParamDTO = {
        userId: existingUserId,
        answer: 0,
      };

      // Prima risposta
      await service.submitAnswer(existingQuizId, answerDto);

      // Seconda risposta (dovrebbe fallire)
      await expect(service.submitAnswer(existingQuizId, answerDto))
        .rejects
        .toThrow(BadRequestException);
    });

    it('should throw NotFoundException for non-existent quiz', async () => {
      const answerDto: QuizAnswerParamDTO = {
        userId: existingUserId,
        answer: 0,
      };

      const nonExistentQuizId = 999999;

      await expect(service.submitAnswer(nonExistentQuizId, answerDto))
        .rejects
        .toThrow(NotFoundException);
    });
  });

  describe('getLeaderboard()', () => {
    it('should return leaderboard with correct DTO structure', async () => {
      const result = await service.getLeaderboard();

      expect(Array.isArray(result)).toBe(true);

      if (result.length > 0) {
        const firstUser = result[0] as LeaderboardResponseDTO;
        expect(firstUser).toHaveProperty('nickname');
        expect(typeof firstUser.nickname).toBe('string');
        expect(firstUser).toHaveProperty('_count');
        expect(firstUser._count).toHaveProperty('answers');
        expect(typeof firstUser._count.answers).toBe('number');
      }
    });

    it('should be sorted by correct answers count (descending)', async () => {
      // Crea alcune risposte per testare l'ordinamento
      const user1 = await prisma.user.create({
        data: { email: 'test1@test.com', nickname: 'testuser1' }
      });

      const user2 = await prisma.user.create({
        data: { email: 'test2@test.com', nickname: 'testuser2' }
      });

      // User1: 3 risposte corrette
      await prisma.answer.createMany({
        data: [
          { userId: user1.id, quizId: existingQuizId, isCorrect: true },
          { userId: user1.id, quizId: existingQuizId + 1, isCorrect: true },
          { userId: user1.id, quizId: existingQuizId + 2, isCorrect: true },
        ]
      });

      // User2: 1 risposta corretta
      await prisma.answer.create({
        data: { userId: user2.id, quizId: existingQuizId, isCorrect: true }
      });

      const result = await service.getLeaderboard();

      // Verifica ordinamento
      if (result.length >= 2) {
        // testuser1 dovrebbe essere prima di testuser2
        const user1Index = result.findIndex(u => u.nickname === 'testuser1');
        const user2Index = result.findIndex(u => u.nickname === 'testuser2');

        expect(user1Index).toBeLessThan(user2Index);
        expect(result[user1Index]._count.answers).toBeGreaterThan(result[user2Index]._count.answers);
      }

      // Cleanup
      await prisma.answer.deleteMany({ where: { userId: { in: [user1.id, user2.id] } } });
      await prisma.user.deleteMany({ where: { id: { in: [user1.id, user2.id] } } });
    });

    it('should limit to top 10 users', async () => {
      const result = await service.getLeaderboard();
      expect(result.length).toBeLessThanOrEqual(10);
    });
  });
});

// vim: set tabstop=2 shiftwidth=2 expandtab colorcolumn=121 :
