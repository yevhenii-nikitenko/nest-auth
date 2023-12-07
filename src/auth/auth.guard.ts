import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { verify, Secret } from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(@InjectRedis() private readonly redis: Redis) { }
    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const token = request.headers['authorization'].split(' ')[1];

        if (!token) throw new UnauthorizedException();

        const tokenIsInBlackList = await this.redis.get(token);

        if (tokenIsInBlackList === 'true') throw new UnauthorizedException();

        try {
            const decoded = await verify(
                token,
                process.env.JWT_SECRET as Secret
            );

            request.auth = {
                id: decoded['id'],
            };

            return true;
        } catch (err) {
            return false;
        }
    }
}
