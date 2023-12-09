import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import * as bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { AuthRepository } from './auth.repository';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private authRepository: AuthRepository
    ) { }
    
    async signup(createUserDto: CreateUserDto): Promise<User> {
        const { username, password } = createUserDto

        const user: User | undefined = await this.authRepository.findOne(username)

        if (user) {
            throw new ConflictException('User already exists!')
        }

        const salt: string = await bcrypt.genSalt(10)
        const hashedPassword: string = await bcrypt.hash(password, salt)

        const payload: JwtPayload = { username }
        const token: string = this.jwtService.sign(payload)

        const newUser: User = { id: uuidv4(), username, password: hashedPassword, token }
        
        return await this.authRepository.createOne(newUser)
    }

    async signin(getUserDto: GetUserDto): Promise<User> {
        const { username, password } = getUserDto

        const user: User | undefined = await this.authRepository.findOne(username)

        if (!user) {
            throw new NotFoundException('User not found!')
        }

        const isMatch: boolean = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            throw new BadRequestException('Invalid credentials!')
        }

        const payload: JwtPayload = { username }
        user.token = this.jwtService.sign(payload)

        return user
    }
}
