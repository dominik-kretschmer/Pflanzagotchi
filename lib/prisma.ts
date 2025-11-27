import "dotenv/config";
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../prisma/generated/client';

const adapter = new PrismaMariaDb({
    host: 'localhost',
    user: 'root',
    password: 'test12345',
    database: 'plant_db',
    port:'3306',
});

const prisma = new PrismaClient({ adapter });

export { prisma };