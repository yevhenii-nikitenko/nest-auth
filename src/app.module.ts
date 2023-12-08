import { Module } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

import { AuthModule } from './auth/auth.module';
import { User } from './db/entities/user';
import CreateUsersTable1683792563384 from './db/migrations/users';

@Module({
    imports: [
        ConfigModule.forRoot(),
        RedisModule.forRoot({
            config: {
                url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
            },
        }),
        ThrottlerModule.forRoot([
            {
                ttl: 60000,
                limit: 20,
            },
        ]),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT,
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            entities: [User],
            migrations: [CreateUsersTable1683792563384],
            migrationsRun: true,
        }),
        AuthModule,
    ],
    controllers: [],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
    exports: [],
})
export class AppModule { }
