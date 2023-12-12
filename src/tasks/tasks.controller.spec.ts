import { Test, TestingModule } from "@nestjs/testing"
import { TasksController } from "./tasks.controller"
import { TasksService } from "./tasks.service"
import { Task } from "./task.entity"
import { TasksStatus } from "./tasks-status.enum"
import { GetTasksFilterDto } from "./dto/get-tasks.dto"
import { User } from "../auth/user.entity"
import { PassportModule } from "@nestjs/passport"
import { CreateTaskDto } from "./dto/create-tasks.dto"
import { UpdateTasksStatusDto } from "./dto/update-tasks-status.dto"
import { beforeEach, describe, expect, it, vi } from "vitest"

const mockUser: User = { id: 'user1', username: 'username', password: 'password', token: 'token' }
const mockTask: Task = { id: 'task1', userId: 'user1', title: 'title', description: 'description', status: TasksStatus.OPEN }

describe('TasksController', () => {
    let tasksController: TasksController
    let tasksService: TasksService

    const mockTasksService = {
        createTask: vi.fn(),
        getTaskById: vi.fn(),
        getAllTasks: vi.fn(),
        getTasksByFilter: vi.fn(),
        deleteTask: vi.fn(),
        updateTaskStatus: vi.fn()
    }

    beforeEach(async () => {
        const testingModule: TestingModule = await Test.createTestingModule({
            imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
            controllers: [TasksController],
            providers: [
                {
                    provide: TasksService,
                    useValue: mockTasksService
                }
            ]
        }).compile()

        tasksController = testingModule.get<TasksController>(TasksController)
        tasksService = testingModule.get<TasksService>(TasksService)
    })

    describe('Post | /tasks | Create a task', () => {
        it('should create a task', async () => {
            const createTaskDto: CreateTaskDto = { description: 'description', title: 'title' }
            vi.spyOn(tasksService, 'createTask').mockResolvedValue(mockTask)
            await expect(tasksController.createTask(createTaskDto, mockUser)).resolves.toStrictEqual(mockTask)
            expect(tasksService.createTask).toHaveBeenCalled()
        })
    })

    describe('GET | /tasks/{id} | Get a task by id', () => {
        it('should return a task by id', async () => {
            vi.spyOn(tasksService, 'getTaskById').mockResolvedValue(mockTask)
            await expect(tasksController.getTaskById(mockTask.id, mockUser)).resolves.toStrictEqual(mockTask)
            expect(tasksService.getTaskById).toHaveBeenCalled()
        })
    })

    describe('GET | /tasks | Get all tasks', () => {
        it('should return all tasks', async () => {
            vi.spyOn(tasksService, 'getAllTasks').mockResolvedValue([mockTask])
            await expect(tasksController.getAllTasks(mockUser)).resolves.toStrictEqual([mockTask])
            expect(tasksService.getAllTasks).toHaveBeenCalled()
        })
    })

    describe('GET | /tasks/search | Search tasks', () => {
        it('should return tasks by filter', async () => {
            const getTasksFilterDto: GetTasksFilterDto = { search: 'search', status: TasksStatus.OPEN }
            vi.spyOn(tasksService, 'getTasksByFilter').mockResolvedValue([mockTask])
            await expect(tasksController.getTasksByFilter(getTasksFilterDto, mockUser)).resolves.toStrictEqual([mockTask])
            expect(tasksService.getTasksByFilter).toHaveBeenCalled()
        })
    })

    describe('Delete | /tasks/{id} | Delete Task', () => {
        it('should delete a task', async () => {
            vi.spyOn(tasksService, 'deleteTask').mockImplementation(() => Promise.resolve())
            await tasksController.deleteTask(mockTask.id, mockUser)
            expect(tasksService.deleteTask).toHaveBeenCalled()
        })
    })

    describe('Patch | /tasks/{id}/status | Update Task Status By Id', () => {
        it('should update a task status by id', async () => {
            const updateTasksStatusDto: UpdateTasksStatusDto = { status: TasksStatus.DONE }
            vi.spyOn(tasksService, 'updateTaskStatus').mockResolvedValue(mockTask)
            await expect(tasksController.updateTaskStatus(mockTask.id, updateTasksStatusDto, mockUser)).resolves.toStrictEqual(mockTask)
            expect(tasksService.updateTaskStatus).toHaveBeenCalled()
        })
    })
})