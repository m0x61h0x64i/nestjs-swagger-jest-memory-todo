import { Test, TestingModule } from "@nestjs/testing"
import { TasksService } from "./tasks.service"
import { TasksStatus } from "./tasks-status.enum"
import { Task } from "./task.entity"
import { User } from "src/auth/user.entity"
import { NotFoundException } from "@nestjs/common"
import { GetTasksFilterDto } from "./dto/get-tasks.dto"
import { CreateTaskDto } from "./dto/create-tasks.dto"
import { UpdateTasksStatusDto } from "./dto/update-tasks-status.dto"
import { TasksRepository } from "./tasks.repository"

const mockUser: User = { id: 'user1', username: 'username', password: 'password', token: 'token' }
const mockTask: Task = { id: 'task1', userId: 'user1', title: 'title', description: 'description', status: TasksStatus.OPEN }

describe('TasksService', () => {
    let tasksService: TasksService;
    let tasksRepository: TasksRepository;

    const mockTasksRepository = {
        createOne: jest.fn(),
        findOne: jest.fn(),
        findMany: jest.fn(),
        search: jest.fn(),
        deleteOne: jest.fn(),
        updateOne: jest.fn()
    }

    beforeEach(async () => {
        const testingModule: TestingModule = await Test.createTestingModule({
            providers: [
                TasksService,
                {
                    provide: TasksRepository,
                    useValue: mockTasksRepository
                }
            ]
        }).compile()

        tasksService = testingModule.get<TasksService>(TasksService)
        tasksRepository = testingModule.get<TasksRepository>(TasksRepository)
    })

    describe('createTask', () => {
        it('should create a task', async () => {
            const createTaskDto: CreateTaskDto = { title: 'some title', description: 'some description' }
            jest.spyOn(tasksRepository, 'createOne').mockResolvedValue(mockTask)
            await expect(tasksService.createTask(createTaskDto, mockUser.id)).resolves.toStrictEqual(mockTask)
            expect(tasksRepository.createOne).toHaveBeenCalled()
        })
    })

    describe('getTaskById', () => {
        it('should return a task', async () => {
            jest.spyOn(tasksRepository, 'findOne').mockResolvedValue(mockTask)
            await expect(tasksService.getTaskById(mockTask.id, mockUser.id)).resolves.toStrictEqual(mockTask)
            expect(tasksRepository.findOne).toHaveBeenCalled()
        })

        it('should throw not found error', async () => {
            jest.spyOn(tasksRepository, 'findOne').mockResolvedValue(undefined)
            await expect(tasksService.getTaskById(mockTask.id, mockUser.id)).rejects.toThrow(NotFoundException)
            expect(tasksRepository.findOne).toHaveBeenCalled()
        })
    })
    
    describe('getAllTasks', () => {
        it('should return all tasks', async () => {
            jest.spyOn(tasksRepository, 'findMany').mockResolvedValue([mockTask])
            await expect(tasksService.getAllTasks(mockUser.id)).resolves.toStrictEqual([mockTask])
            expect(tasksRepository.findMany).toHaveBeenCalled()
        })
    })

    describe('getTasksByFilter', () => {
        it('should return tasks by filter', async () => {
            jest.spyOn(tasksService, 'getAllTasks').mockResolvedValue([mockTask])
            jest.spyOn(tasksRepository, 'search').mockResolvedValue([mockTask])
            const filter: GetTasksFilterDto = { search: 'title', status: TasksStatus.OPEN }
            await expect(tasksService.getTasksByFilter(filter, mockUser.id)).resolves.toStrictEqual([mockTask])
            expect(tasksService.getAllTasks).toHaveBeenCalled()
            expect(tasksRepository.search).toHaveBeenCalled()
        })
    })

    describe('deleteTask', () => {
        it('should delete task when found', async () => {
            jest.spyOn(tasksService, 'getTaskById').mockResolvedValue(mockTask)
            jest.spyOn(tasksRepository, 'deleteOne').mockResolvedValue(undefined)
            await tasksService.deleteTask(mockTask.id, mockUser.id)
            expect(tasksService.getTaskById).toHaveBeenCalled()
            expect(tasksRepository.deleteOne).toHaveBeenCalled()
        })

        it('should throw error when task not found', async () => {
            jest.spyOn(tasksRepository, 'findOne').mockResolvedValue(undefined)
            await expect(tasksService.deleteTask('randomId', mockUser.id)).rejects.toThrow(NotFoundException)
            expect(tasksRepository.findOne).toHaveBeenCalled()
        })
    })

    describe('updateTaskStatus', () => {
        const updateTasksStatusDto: UpdateTasksStatusDto = { status: TasksStatus.DONE }

        it('should update task status when found', async () => {
            jest.spyOn(tasksService, 'getTaskById').mockResolvedValue(mockTask)
            jest.spyOn(tasksRepository, 'updateOne').mockResolvedValue(undefined)
            const result = await tasksService.updateTaskStatus(mockTask.id, updateTasksStatusDto, mockUser.id)
            expect(result.status).toStrictEqual(updateTasksStatusDto.status)
            expect(tasksService.getTaskById).toHaveBeenCalled()
            expect(tasksRepository.updateOne).toHaveBeenCalled()
        })

        it('should throw error when task not found', async () => {
            jest.spyOn(tasksRepository, 'findOne').mockResolvedValue(undefined)
            await expect(tasksService.updateTaskStatus('randomId', updateTasksStatusDto, mockUser.id)).rejects.toThrow(NotFoundException)
            expect(tasksRepository.findOne).toHaveBeenCalled()
        })
    })
})