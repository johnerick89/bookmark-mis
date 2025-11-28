import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserStatus } from 'generated/prisma/client';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super({ usernameField: 'email' });
  }

  async validate(
    email: string,
    password: string,
  ): Promise<{
    id: string;
    email: string;
    name: string;
    status: UserStatus;
    created_at: Date;
    updated_at: Date;
  }> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      status: user.status,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }
}
