import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { GetUserDto } from './dto/get-user.dto';
import { ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConflictSwagger } from '../swagger/conflict.swagger';
import { BadRequestSwagger } from '../swagger/bad-request.swagger';
import { NotFoundSwagger } from '../swagger/not-found.swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @ApiOperation({ summary: 'User Signup' })
    @ApiCreatedResponse({ description: 'OK', type: User })
    @ApiConflictResponse({ description: 'User already exists!', type: ConflictSwagger })
    @ApiBadRequestResponse({ description: 'Validation Error', type: BadRequestSwagger })
    @Post('signup')
    async signup(
        @Body(ValidationPipe) createUserDto: CreateUserDto
    ): Promise<User> {
        return await this.authService.signup(createUserDto)
    }

    @ApiOperation({ summary: 'User Signin' })
    @ApiOkResponse({ description: 'OK', type: User })
    @ApiNotFoundResponse({ description: 'User not found!', type: NotFoundSwagger })
    @ApiBadRequestResponse({ description: 'Invalid credentials!', type: BadRequestSwagger })
    @HttpCode(HttpStatus.OK)
    @Post('signin')
    async signin(
        @Body(ValidationPipe) getUserDto: GetUserDto
    ): Promise<User> {
        return await this.authService.signin(getUserDto)
    }
}
