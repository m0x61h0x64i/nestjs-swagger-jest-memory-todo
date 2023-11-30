import { Test } from "@nestjs/testing"
import { TasksService } from "./tasks.service"
import { TasksStatus } from "./tasks-status.enum"
import { Task } from "./task.entity"
import { User } from "src/auth/user.entity"
import { NotFoundException } from "@nestjs/common"
import { GetTasksFilterDto } from "./dto/get-tasks.dto"
import { CreateTaskDto } from "./dto/create-tasks.dto"
import { UpdateTasksStatusDto } from "./dto/update-tasks-status.dto"

const mockUser: User = { id: 'user1', username: 'username', password: 'password', token: 'token' }
const mockTask: Task = { id: 'task1', userId: 'user1', title: 'title', description: 'description', status: TasksStatus.OPEN }

describe('TasksService', () => {
    let tasksService: TasksService;

    beforeEach(async () => {
        const TestingModule = await Test.createTestingModule({
            providers: [TasksService]
        }).compile()

        tasksService = TestingModule.get<TasksService>(TasksService)
    })

    describe('getTaskById', () => {
        it('should return a task by id when found', () => {
            tasksService['tasks'] = [mockTask]
            const result = tasksService.getTaskById(mockTask.id, mockUser)
            expect(result).toBe(mockTask)
        })

        it('show throw error when task not found', () => {
            tasksService['tasks'] = []
            expect(() => tasksService.getTaskById('randomId', mockUser)).toThrow(new NotFoundException('Task Not Found!'))
        })
    })

    describe('getAllTasks', () => {
        it('should return all tasks', () => {
            tasksService['tasks'] = [mockTask]
            const result = tasksService.getAllTasks(mockUser)
            expect(result).toEqual([mockTask])
        })
    })

    describe('getTasksByFilter', () => {
        it('should return tasks by filter', () => {
            tasksService['tasks'] = [mockTask]
            const filter: GetTasksFilterDto = { search: 'title', status: TasksStatus.OPEN }
            const result = tasksService.getTasksByFilter(filter, mockUser)
            expect(result).toEqual([mockTask])
        })
    })

    describe('createTask', () => {
        it('should create a task', () => {
            const createTaskDto: CreateTaskDto = { title: 'some title', description: 'some description' }
            const newTask = tasksService.createTask(createTaskDto, mockUser)
            tasksService['tasks'] = [newTask]
            expect(tasksService['tasks']).toEqual([newTask])
        })
    })

    describe('deleteTask', () => {
        it('should delete task when found', () => {
            tasksService['tasks'] = [mockTask]
            tasksService.deleteTask(mockTask.id, mockUser)
            expect(tasksService['tasks']).toHaveLength(0)
        })

        it('should throw error when task not found', () => {
            tasksService['tasks'] = []
            expect(() => tasksService.deleteTask('randomId', mockUser)).toThrow(new NotFoundException('Task Not Found!'))
        })
    })

    describe('updateTaskStatus', () => {
        const updateTasksStatusDto: UpdateTasksStatusDto = { status: TasksStatus.DONE }
        
        it('should update task status when found', () => {
            tasksService['tasks'] = [mockTask]
            const result = tasksService.updateTaskStatus(mockTask.id, updateTasksStatusDto, mockUser)
            expect(result.status).toBe(TasksStatus.DONE)
        })

        it('should throw error when task not found', () => {
            tasksService['tasks'] = []
            expect(() => tasksService.updateTaskStatus('randomId', updateTasksStatusDto, mockUser)).toThrow(new NotFoundException('Task Not Found!'))
        })
    })
})