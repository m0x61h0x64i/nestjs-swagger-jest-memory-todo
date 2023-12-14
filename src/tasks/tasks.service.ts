import { Injectable, NotFoundException } from '@nestjs/common';
import { TasksStatus } from './tasks-status.enum';
import { Task } from './task.entity';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDto } from './dto/create-tasks.dto';
import { GetTasksFilterDto } from './dto/get-tasks.dto';
import { UpdateTasksStatusDto } from './dto/update-tasks-status.dto';
import { TasksRepository } from './tasks.repository';

@Injectable()
export class TasksService {
    constructor(private tasksRepository: TasksRepository) {}

    async createTask(
        createTaskDto: CreateTaskDto,
        userId: string
    ): Promise<Task> {
        const { title, description } = createTaskDto;

        const newTask: Task = {
            id: uuidv4(),
            userId,
            title,
            description,
            status: TasksStatus.OPEN,
        };

        return await this.tasksRepository.createOne(newTask);
    }

    async getTaskById(id: string, userId: string): Promise<Task> {
        const userTask: Task | undefined = await this.tasksRepository.findOne(id, userId)

        if (!userTask) {
            throw new NotFoundException('Task Not Found!');
        }

        return userTask;
    }

    async getAllTasks(userId: string): Promise<Task[]> {
        return await this.tasksRepository.findMany(userId)
    }

    async getTasksByFilter(
        getTasksDto: GetTasksFilterDto,
        userId: string
    ): Promise<Task[]> {
        const userTasks: Task[] = await this.getAllTasks(userId)
        return await this.tasksRepository.search(userTasks, getTasksDto)
    }

    async updateTaskStatus(
        id: string,
        updateTasksStatusDto: UpdateTasksStatusDto,
        userId: string
    ): Promise<Task> {
        const userTask: Task = await this.getTaskById(id, userId);

        await this.tasksRepository.updateOne(userTask.id, updateTasksStatusDto)

        return { ...userTask, ...updateTasksStatusDto };
    }

    async deleteTask(id: string, userId: string): Promise<void> {
        const userTask: Task = await this.getTaskById(id, userId);
        await this.tasksRepository.deleteOne(userTask.id)
    }
}
