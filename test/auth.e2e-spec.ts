import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request = require('supertest')
import { AppModule } from '../src/app.module';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { GetUserDto } from 'src/auth/dto/get-user.dto';

const signupUser: CreateUserDto = { username: 'username', password: 'Password!@#' }
const signinUser: GetUserDto = { username: 'username', password: 'Password!@#' }

describe('Auth Controller (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    describe('Auth', () => {
        it('Post | /auth/signup | User signup', () => {
            request(app.getHttpServer())
                .post('/auth/signup')
                .send(signupUser)
                .expect(201)
        })

        it('Post | /auth/signin | User signin', () => {
            request(app.getHttpServer())
                .post('/auth/signin')
                .send(signinUser)
                .expect(200)
        })
    })
});
