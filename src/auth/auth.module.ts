import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { AuthRepository } from './auth.repository';

@Module({
    imports: [
        PassportModule.register({
            defaultStrategy: 'jwt'
        }),
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '24h' }
        })
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, AuthRepository],
    exports: [JwtStrategy, PassportModule]
})
export class AuthModule { }
