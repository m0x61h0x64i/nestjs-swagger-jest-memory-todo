import { MaxLength, MinLength, IsString, Matches } from "class-validator"

// if we specify MinLength we dont need to specify IsNotEmpty
export class CreateUserDto {
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username: string

    @IsString()
    @MinLength(8)
    @MaxLength(30)
    @Matches(
        /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        { message: 'password needs at least one uppercase letter and one lowercase letter and one number or one special character' }
    )
    password: string
}