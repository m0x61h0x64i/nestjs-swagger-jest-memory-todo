import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request = require('supertest')
import { AppModule } from '../src/app.module';
import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from 'src/tasks/dto/create-tasks.dto';
import { Task } from 'src/tasks/task.entity';
import { TasksStatus } from 'src/tasks/tasks-status.enum';
import { GetTasksFilterDto } from 'src/tasks/dto/get-tasks.dto';
import { UpdateTasksStatusDto } from 'src/tasks/dto/update-tasks-status.dto';

const task: Task = { id: 'taskId', description: 'description', title: 'title', userId: 'userId', status: TasksStatus.OPEN }
const user: User = { id: 'userId', username: 'username', password: 'Password!@#', token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXJuYW1lIiwiaWF0IjoxNzAyNTY0NDY3LCJleHAiOjE3MDI2NTA4Njd9.zJitrQO-d9WTEFXM6fECC8DKp4Xa28Hi_9HS_tG0XZA' }
const createTaskDto: CreateTaskDto = { description: 'description', title: 'title' }
const getTasksFilterDto: GetTasksFilterDto = { query: 'description' }
const updateTasksStatusDto: UpdateTasksStatusDto = { status: TasksStatus.DONE }

describe('Tasks Controller (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    describe('Tasks', () => {
        it('Post | /tasks | Create a task', () => {
            request(app.getHttpServer())
                .post('/tasks')
                .set('Authorization', `Bearer ${user.token}`)
                .send(createTaskDto)
                .expect(HttpStatus.CREATED)
        })

        it('GET | /tasks/{id} | Get a task by id', () => {
            request(app.getHttpServer())
                .post(`/tasks/${task.id}`)
                .set('Authorization', `Bearer ${user.token}`)
                .send(createTaskDto)
                .expect(HttpStatus.OK)
        })

        it('GET | /tasks | Get all tasks', () => {
            request(app.getHttpServer())
                .get('/tasks')
                .set('Authorization', `Bearer ${user.token}`)
                .expect(HttpStatus.OK)
        })

        it('GET | /tasks/search | Search tasks', () => {
            request(app.getHttpServer())
                .get(`/tasks/search?query=${getTasksFilterDto.query}`)
                .set('Authorization', `Bearer ${user.token}`)
                .expect(HttpStatus.OK)
        })

        it('Patch | /tasks/{id}/status | Update Task Status By Id', () => {
            request(app.getHttpServer())
                .get(`/tasks/${task.id}/status`)
                .set('Authorization', `Bearer ${user.token}`)
                .send(updateTasksStatusDto)
                .expect(HttpStatus.OK)
        })

        it('Delete | /tasks/{id} | Delete Task', () => {
            request(app.getHttpServer())
                .get(`/tasks/${task.id}`)
                .set('Authorization', `Bearer ${user.token}`)
                .expect(HttpStatus.NO_CONTENT)
        })
    })
});