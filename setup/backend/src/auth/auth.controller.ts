// Aggiunto dallo script setup.sh

import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiOkResponse, ApiUnauthorizedResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { LoginRequestDTO } from './dto/login-request.dto';
import { LoginResponseDTO, LoginErrorResponseDTO } from './dto/login-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login semplificato' })
  @ApiOkResponse({
    description: 'Login effettuato con successo',
    type: LoginResponseDTO
  })
  @ApiUnauthorizedResponse({
    description: 'Nickname non trovato',
    type: LoginErrorResponseDTO
  })
  @ApiBadRequestResponse({
    description: 'Validazione fallita (es. nickname troppo corto)'
  })
  login(@Body() loginDTO: LoginRequestDTO): Promise<LoginResponseDTO> {
    return this.authService.login(loginDTO.nickname);
  }
}

// vim: set tabstop=2 shiftwidth=2 expandtab colorcolumn=121 :
