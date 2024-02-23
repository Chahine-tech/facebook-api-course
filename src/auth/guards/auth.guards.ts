import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as jwt from 'jsonwebtoken';

export interface IJwtPayload {
  id: string;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { authorization: token } = request.headers;
    if (!token) {
      throw new HttpException('Token not found', HttpStatus.UNAUTHORIZED);
    }
    if (!token.startsWith('Bearer ')) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    const jwtToken = token.slice(7);
    try {
      const payload = jwt.verify(
        jwtToken,
        process.env.JWT_SECRET,
      ) as IJwtPayload;
      const user = await this.usersService.findOne(payload.id);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
      }
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new HttpException('Token expired', HttpStatus.UNAUTHORIZED);
      } else {
        throw new HttpException(
          'Authentication failed',
          HttpStatus.UNAUTHORIZED,
        );
      }
    }

    return true;
  }
}
