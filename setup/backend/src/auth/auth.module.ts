// Aggiunto dallo script setup.sh

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

/**
 * Il modulo Auth raggruppa la logica di autenticazione mock.
 * Non importiamo PrismaModule qui perché lo abbiamo segnato come @Global()
 * nel suo modulo, quindi AuthService vi ha già accesso.
 */
@Module({
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}

// vim: set tabstop=2 shiftwidth=2 expandtab colorcolumn=121 :
