import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "./jwt-payload.interface";
import { User } from "./user.entity";
import { AuthRepository } from "./auth.repository";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private authRepository: AuthRepository
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET
        })
    }

    async validate(payload: JwtPayload): Promise<User> {
        const { username } = payload
        const user: User | undefined = this.authRepository.signin(username)

        if (!user) {
            throw new UnauthorizedException()
        }

        return user
    }
}