import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { GetUserDto } from './dto/get-user.dto';
import { ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConflictSwagger } from 'src/swagger/conflict.swagger';
import { BadRequestSwagger } from 'src/swagger/bad-request.swagger';
import { NotFoundSwagger } from 'src/swagger/not-found.swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }
    
    @ApiOperation({ summary: 'User Signup' })
    @ApiCreatedResponse({ description: 'OK' })
    @ApiConflictResponse({ description: 'User already exists!', type: ConflictSwagger })
    @ApiBadRequestResponse({ description: 'Validation Error', type: BadRequestSwagger })
    @Post('signup')
    createUser(
        @Body(ValidationPipe) createUserDto: CreateUserDto
    ): Promise<User> {
        return this.authService.createUser(createUserDto)
    }

    @ApiOperation({ summary: 'User Signin' })
    @ApiOkResponse({ description: 'OK' })
    @ApiNotFoundResponse({ description: 'User not found!', type: NotFoundSwagger })
    @ApiBadRequestResponse({ description: 'Invalid credentials!', type: BadRequestSwagger })
    @HttpCode(HttpStatus.OK)
    @Post('signin')
    getUser(
        @Body(ValidationPipe) getUserDto: GetUserDto
    ): Promise<User> {
        return this.authService.getUser(getUserDto)
    }
}
