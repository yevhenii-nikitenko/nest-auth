import {
    Controller,
    Get,
    Post,
    Body,
    Headers,
    HttpCode,
    UseGuards,
    Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/db/entities/user';
import { AuthGuard } from './auth.guard';
import { Request } from 'express';

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @HttpCode(200)
    @Post('/sign-in')
    signIn(@Body() auth: Pick<User, 'password' | 'email'>) {
        return this.authService.signIn(auth);
    }

    @HttpCode(201)
    @Post('/sign-up')
    signUp(@Body() newUser: User) {
        // possible validation logic

        return this.authService.signUp(newUser);
    }

    @HttpCode(204)
    @Post('/sign-out')
    signOut(@Headers() headers) {
        return this.authService.signOut(headers['authorization'].split(' ')[1]);
    }

    @HttpCode(200)
    @Get('/me')
    @UseGuards(AuthGuard)
    me(@Req() request: Request) {
        return this.authService.me(request['auth'].id);
    }
}
