import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { ConfigService } from '@nestjs/config';

import { User } from 'src/db/entities/user';
import { encrypt, decrypt } from 'src/helpers/crypto';

@Injectable()
export class AuthService {
    private userRepository: Repository<User>;

    constructor(
        private dataSource: DataSource,
        private config: ConfigService,
        @InjectRedis() private readonly redis: Redis
    ) {
        this.userRepository = dataSource.getRepository(User);
    }
    async signIn(auth: Pick<User, 'email' | 'password'>): Promise<any> {
        try {
            const user = await this.userRepository.findOneBy({
                email: auth.email,
            });

            if (!user) {
                throw new HttpException(
                    {
                        error: 'User not found',
                    },
                    HttpStatus.NOT_FOUND
                );
            }

            if (auth.password !== decrypt(user.password)) {
                throw new HttpException(
                    {
                        error: 'wrong password',
                    },
                    HttpStatus.UNAUTHORIZED
                );
            }

            const ttl = +this.config.get('JWT_TTL') || 86400;

            const token = jwt.sign(
                {
                    id: user.id,
                },
                this.config.get('JWT_SECRET'),
                {
                    expiresIn: ttl,
                }
            );

            return { token, ttl };
        } catch (err) {
            throw err;
        }
    }

    async signUp(user: Omit<User, 'id'>): Promise<void> {
        try {
            const { password, ...dbUserDTO } = user;

            const emailExists = await this.userRepository.findOneBy({
                email: dbUserDTO.email,
            });

            if (emailExists) {
                throw new HttpException(
                    {
                        error: 'E-mail is already taken',
                    },
                    HttpStatus.BAD_REQUEST
                );
            }

            await this.userRepository.insert({
                ...dbUserDTO,
                password: encrypt(password),
            });

            return;
        } catch (err) {
            throw err;
        }
    }

    async signOut(token: string): Promise<void> {
        await this.redis.set(
            token,
            true,
            'EX',
            +this.config.get('JWT_TTL') || 86400
        );
    }

    async me(id: number): Promise<Omit<User, 'password'>> {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...user } = await this.userRepository.findOneBy({
            id,
        });

        return user;
    }
}
