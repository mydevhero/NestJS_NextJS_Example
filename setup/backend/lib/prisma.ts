// Aggiunto dallo script setup.sh

import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client'

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

export { prisma }

// vim: set tabstop=2 shiftwidth=2 expandtab colorcolumn=121 :
