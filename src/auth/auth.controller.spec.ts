import { Test, TestingModule } from "@nestjs/testing"
import { AuthService } from "./auth.service"
import { AuthController } from "./auth.controller"
import { User } from "./user.entity"
import { CreateUserDto } from "./dto/create-user.dto"
import { GetUserDto } from "./dto/get-user.dto"
import { beforeEach, describe, expect, it, vi } from "vitest"

const mockUser: User = { id: 'user1', username: 'username', password: 'password', token: 'token' }

describe('AuthController', () => {
    let authController: AuthController
    let authService: AuthService

    const mockAuthService = {
        signup: vi.fn(),
        signin: vi.fn()
    }

    beforeEach(async () => {
        const testingModule: TestingModule = await Test.createTestingModule({
            providers: [
                AuthController,
                {
                    provide: AuthService,
                    useValue: mockAuthService
                }
            ]
        }).compile()
    
        authService = testingModule.get<AuthService>(AuthService)
        authController = testingModule.get<AuthController>(AuthController)
    })

    describe('signup', () => {
        it('should signup new user', async () => {
            const createUserDto: CreateUserDto = { username: 'username', password: 'password' }
            vi.spyOn(authService, 'signup').mockResolvedValue(mockUser)
            await expect(authController.signup(createUserDto)).resolves.toStrictEqual(mockUser)
            expect(authService.signup).toHaveBeenCalled()
        })
    })

    describe('signin', () => {
        it('should signin user', async () => {
            const getUserDto: GetUserDto = { username: 'username', password: 'password' }
            vi.spyOn(authService, 'signin').mockResolvedValue(mockUser)
            await expect(authController.signin(getUserDto)).resolves.toStrictEqual(mockUser)
            expect(authService.signin).toHaveBeenCalled()
        })
    })
})