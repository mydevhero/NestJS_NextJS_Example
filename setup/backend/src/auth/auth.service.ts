// Aggiunto dallo script setup.sh

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { prisma } from '../../lib/prisma';

@Injectable()
// Aggiunto dallo script setup.sh

export class AuthService {
  async login(nickname: string) {
    const user = await prisma.user.findUnique({
      where: { nickname },
    });

    if (!user) {
      throw new UnauthorizedException('Utente non trovato. Usa Alice, Bob o Charlie.');
    }

    // In un sistema reale qui genereremmo un JWT.
    // Per questo test (vogliono così), restituisco i dati utente per la sessione frontend.
    return user;
  }
}

// vim: set tabstop=2 shiftwidth=2 expandtab colorcolumn=121 :
