// Aggiunto dallo script setup.sh

import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';

// 1. Mock dell'intero modulo prisma PRIMA degli import
jest.mock('../../lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

// 2. Importa DOPO il mock
import { prisma } from '../../lib/prisma';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('dovrebbe restituire l\'utente esistente', async () => {
      const mockUser = {
        id: 1,
        nickname: 'Alice',
        email: 'alice@example.com',
      };

      // 3. Usa il mock
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.login('Alice');
      expect(result).toEqual(mockUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { nickname: 'Alice' },
      });
    });

    it('dovrebbe lanciare UnauthorizedException se l\'utente non esiste', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.login('Sconosciuto')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});

// vim: set tabstop=2 shiftwidth=2 expandtab colorcolumn=121 :
