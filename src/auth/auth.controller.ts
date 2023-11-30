import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { GetUserDto } from './dto/get-user.dto';
import { ApiBadRequestResponse, ApiConflictResponse, ApiNotFoundResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }
    
    @ApiOperation({ summary: 'User Signup' })
    @ApiConflictResponse({ description: 'User already exists!' })
    @ApiBadRequestResponse({ description: 'Validation Error' })
    @Post('signup')
    createUser(
        @Body(ValidationPipe) createUserDto: CreateUserDto
    ): Promise<User> {
        return this.authService.createUser(createUserDto)
    }

    @ApiOperation({ summary: 'User Signin' })
    @ApiNotFoundResponse({ description: 'User not found!' })
    @ApiBadRequestResponse({ description: 'Invalid credentials!' })
    @HttpCode(HttpStatus.OK)
    @Post('signin')
    getUser(
        @Body(ValidationPipe) getUserDto: GetUserDto
    ): Promise<User> {
        return this.authService.getUser(getUserDto)
    }
}
