import { AuthService } from "./auth.service"
import { Test, TestingModule } from "@nestjs/testing"
import { AuthRepository } from "./auth.repository"
import { User } from "./user.entity"
import { JwtService } from "@nestjs/jwt"
import { BadRequestException, ConflictException, NotFoundException } from "@nestjs/common"
import * as bcrypt from 'bcrypt'
import { CreateUserDto } from "./dto/create-user.dto"
import { GetUserDto } from "./dto/get-user.dto"

const mockUser: User = { id: 'user1', username: 'username', password: 'password', token: 'token' }

describe('AuthService', () => {
    let authService: AuthService
    let authRepository: AuthRepository
    let jwtService: JwtService

    const mockAuthRepository = {
        createOne: jest.fn(),
        findOne: jest.fn()
    }

    beforeEach(async () => {
        const testingModule: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                JwtService,
                {
                    provide: AuthRepository,
                    useValue: mockAuthRepository
                }
            ]
        }).compile()

        authService = testingModule.get<AuthService>(AuthService)
        authRepository = testingModule.get<AuthRepository>(AuthRepository)
        jwtService = testingModule.get<JwtService>(JwtService)
    })

    describe('signup', () => {
        const createUserDto: CreateUserDto = { username: 'username', password: 'password' }

        it('should signup new user', async () => {
            jest.spyOn(authRepository, 'findOne').mockResolvedValue(undefined)
            jest.spyOn(authRepository, 'createOne').mockResolvedValue(mockUser)
            // This line may wrong
            jest.spyOn(jwtService, 'sign').mockReturnValue('token')
            await expect(authService.signup(createUserDto)).resolves.toStrictEqual(mockUser)
            expect(authRepository.findOne).toHaveBeenCalled()
            expect(authRepository.createOne).toHaveBeenCalled()
            expect(jwtService.sign).toHaveBeenCalled()
        })

        it('should throw conflict error', async () => {
            jest.spyOn(authRepository, 'findOne').mockResolvedValue(mockUser)
            await expect(authService.signup(createUserDto)).rejects.toThrow(ConflictException)
            expect(authRepository.findOne).toHaveBeenCalled()
        })
    })

    describe('signin', () => {
        const getUserDto: GetUserDto = { password: 'password', username: 'username' }

        it('should signin', async () => {
            jest.spyOn(authRepository, 'findOne').mockResolvedValue(mockUser)
            jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true))
            // This line may wrong
            jest.spyOn(jwtService, 'sign').mockReturnValue('token')
            await expect(authService.signin(getUserDto)).resolves.toStrictEqual(mockUser)
            expect(authRepository.findOne).toHaveBeenCalled()
            expect(bcrypt.compare).toHaveBeenCalled()
            expect(jwtService.sign).toHaveBeenCalled()
        })

        it('should throw not found error', async () => {
            jest.spyOn(authRepository, 'findOne').mockResolvedValue(undefined)
            await expect(authService.signin(getUserDto)).rejects.toThrow(NotFoundException)
            expect(authRepository.findOne).toHaveBeenCalled()
        })

        it('should throw bad request error', async () => {
            jest.spyOn(authRepository, 'findOne').mockResolvedValue(mockUser)
            jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false))
            await expect(authService.signin(getUserDto)).rejects.toThrow(BadRequestException)
            expect(authRepository.findOne).toHaveBeenCalled()
            expect(bcrypt.compare).toHaveBeenCalled()
        })
    })
})