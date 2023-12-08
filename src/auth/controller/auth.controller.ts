import {
    Controller,
    Get,
    Post,
    Body,
    Headers,
    HttpCode,
    UseGuards,
    HttpStatus,
    Req,
    HttpException,
} from '@nestjs/common';
import { Request } from 'express';

import { AuthService } from '../service/auth.service';
import { User } from '../../db/entities/user';
import { AuthGuard } from '../auth.guard';
import { authSchema, userSchema } from '../../helpers/validation';
import { Throttle } from '@nestjs/throttler';

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Throttle({ default: { limit: 2, ttl: 60000 } })
    @HttpCode(HttpStatus.OK)
    @Post('/sign-in')
    signIn(@Body() auth: Pick<User, 'password' | 'email'>) {
        const validation = authSchema.validate(auth);

        if (validation.error) {
            throw new HttpException(
                {
                    error: validation.error.message,
                },
                HttpStatus.UNAUTHORIZED
            );
        }

        return this.authService.signIn(auth);
    }

    @HttpCode(HttpStatus.CREATED)
    @Post('/sign-up')
    signUp(@Body() newUser: User) {
        const validation = userSchema.validate(newUser);

        if (validation.error) {
            throw new HttpException(
                {
                    error: validation.error.message,
                },
                HttpStatus.BAD_REQUEST
            );
        }

        return this.authService.signUp(newUser);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Post('/sign-out')
    signOut(@Headers() headers) {
        return this.authService.signOut(headers['authorization'].split(' ')[1]);
    }

    @HttpCode(HttpStatus.OK)
    @Get('/me')
    @UseGuards(AuthGuard)
    me(@Req() request: Request) {
        return this.authService.me(request['auth'].id);
    }
}
