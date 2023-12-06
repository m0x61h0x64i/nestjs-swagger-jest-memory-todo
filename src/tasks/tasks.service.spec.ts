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
        getTaskById: jest.fn(),
        getTasksByFilter: jest.fn(),
        getAllTasks: jest.fn(),
        createTask: jest.fn(),
        deleteTask: jest.fn(),
        updateTaskStatus: jest.fn()
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

    describe('getTaskById', () => {
        it('should return a task by id when found', () => {
            jest.spyOn(tasksRepository, 'getTaskById').mockReturnValue(mockTask)
            const result = tasksService.getTaskById(mockTask.id, mockUser)
            expect(result).toEqual(mockTask)
            expect(tasksRepository.getTaskById).toHaveBeenCalled()
        })

        it('show throw error when task not found', () => {
            jest.spyOn(tasksRepository, 'getTaskById').mockReturnValue(undefined)
            expect(() => tasksService.getTaskById(mockTask.id, mockUser)).toThrow(NotFoundException)
            expect(tasksRepository.getTaskById).toHaveBeenCalled()
        })
    })

    describe('getAllTasks', () => {
        it('should return all tasks', () => {
            jest.spyOn(tasksRepository, 'getAllTasks').mockReturnValue([mockTask])
            const result = tasksService.getAllTasks(mockUser)
            expect(result).toEqual([mockTask])
            expect(tasksRepository.getAllTasks).toHaveBeenCalled()
        })
    })

    describe('getTasksByFilter', () => {
        it('should return tasks by filter', () => {
            jest.spyOn(tasksService, 'getAllTasks').mockReturnValue([mockTask])
            jest.spyOn(tasksRepository, 'getTasksByFilter').mockReturnValue([mockTask])
            const filter: GetTasksFilterDto = { search: 'title', status: TasksStatus.OPEN }
            const result = tasksService.getTasksByFilter(filter, mockUser)
            expect(result).toEqual([mockTask])
            expect(tasksService.getAllTasks).toHaveBeenCalled()
            expect(tasksRepository.getTasksByFilter).toHaveBeenCalled()
        })
    })

    describe('createTask', () => {
        it('should create a task', () => {
            const createTaskDto: CreateTaskDto = { title: 'some title', description: 'some description' }
            jest.spyOn(tasksRepository, 'createTask').mockImplementation()
            const result = tasksService.createTask(createTaskDto, mockUser)
            expect(result).toMatchObject(createTaskDto)
            expect(tasksRepository.createTask).toHaveBeenCalled()
        })
    })

    describe('deleteTask', () => {
        it('should delete task when found', () => {
            jest.spyOn(tasksService, 'getTaskById').mockReturnValue(mockTask)
            jest.spyOn(tasksRepository, 'deleteTask').mockImplementation()
            tasksService.deleteTask(mockTask.id, mockUser)
            expect(tasksService.getTaskById).toHaveBeenCalled()
            expect(tasksRepository.deleteTask).toHaveBeenCalled()
        })

        it('should throw error when task not found', () => {
            jest.spyOn(tasksRepository, 'getTaskById').mockReturnValue(undefined)
            expect(() => tasksService.deleteTask('randomId', mockUser)).toThrow(NotFoundException)
            expect(tasksRepository.getTaskById).toHaveBeenCalled()
        })
    })

    describe('updateTaskStatus', () => {
        const updateTasksStatusDto: UpdateTasksStatusDto = { status: TasksStatus.DONE }

        it('should update task status when found', () => {
            jest.spyOn(tasksService, 'getTaskById').mockReturnValue(mockTask)
            jest.spyOn(tasksRepository, 'updateTaskStatus').mockImplementation()
            const result = tasksService.updateTaskStatus(mockTask.id, updateTasksStatusDto, mockUser)
            expect(result.status).toBe(updateTasksStatusDto.status)
            expect(tasksService.getTaskById).toHaveBeenCalled()
            expect(tasksRepository.updateTaskStatus).toHaveBeenCalled()
        })

        it('should throw error when task not found', () => {
            jest.spyOn(tasksRepository, 'getTaskById').mockReturnValue(undefined)
            expect(() => tasksService.updateTaskStatus('randomId', updateTasksStatusDto, mockUser)).toThrow(NotFoundException)
            expect(tasksRepository.getTaskById).toHaveBeenCalled()
        })
    })
})