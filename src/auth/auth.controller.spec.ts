import { Test, TestingModule } from "@nestjs/testing"
import { AuthService } from "./auth.service"
import { AuthController } from "./auth.controller"
import { User } from "./user.entity"
import { CreateUserDto } from "./dto/create-user.dto"
import { GetUserDto } from "./dto/get-user.dto"

const mockUser: User = { id: 'user1', username: 'username', password: 'password', token: 'token' }

describe('AuthController', () => {
    let authController: AuthController
    let authService: AuthService

    const mockAuthService = {
        signup: jest.fn(),
        signin: jest.fn()
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

    describe('Post | /auth/signup | User signup', () => {
        it('should signup new user', async () => {
            const createUserDto: CreateUserDto = { username: 'username', password: 'password' }
            jest.spyOn(authService, 'signup').mockResolvedValue(mockUser)
            await expect(authController.signup(createUserDto)).resolves.toStrictEqual(mockUser)
            expect(authService.signup).toHaveBeenCalled()
        })
    })

    describe('Post | /auth/signin | User signin', () => {
        it('should signin user', async () => {
            const getUserDto: GetUserDto = { username: 'username', password: 'password' }
            jest.spyOn(authService, 'signin').mockResolvedValue(mockUser)
            await expect(authController.signin(getUserDto)).resolves.toStrictEqual(mockUser)
            expect(authService.signin).toHaveBeenCalled()
        })
    })
})