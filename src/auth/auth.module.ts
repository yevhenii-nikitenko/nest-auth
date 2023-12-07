import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';

@Module({
    imports: [ConfigModule],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule { }
