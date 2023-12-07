import { Module } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { User } from './db/entities/user';

@Module({
    imports: [
        ConfigModule.forRoot(),
        RedisModule.forRoot({
            config: {
                url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
            },
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT,
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            entities: [User],
        }),
        AuthModule,
    ],
    controllers: [],
    providers: [],
    exports: [],
})
export class AppModule { }
