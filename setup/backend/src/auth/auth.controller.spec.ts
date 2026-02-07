// Aggiunto dallo script setup.sh

import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginRequestDTO     } from './dto/login-request.dto'

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('dovrebbe chiamare authService.login con il nickname corretto', async () => {
    // 1. Prepariamo il mock del nickname e il DTO
    const nickname = 'Alice';
    const loginDTO: LoginRequestDTO = { nickname };

    const mockResponse = { id: 1, nickname, email: 'alice@example.com' };
    mockAuthService.login.mockResolvedValue(mockResponse);

    // 2. Chiamiamo il controller passando l'OGGETTO, non la stringa
    const result = await controller.login(loginDTO);

    // 3. Verifichiamo che al service arrivi solo la stringa (perché il controller estrae .nickname)
    expect(service.login).toHaveBeenCalledWith(nickname);
    expect(result).toEqual(mockResponse);
  });
});

// vim: set tabstop=2 shiftwidth=2 expandtab colorcolumn=121 :
