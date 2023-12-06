import { Injectable, NotFoundException } from '@nestjs/common';
import { TasksStatus } from './tasks-status.enum';
import { Task } from './task.entity';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDto } from './dto/create-tasks.dto';
import { GetTasksFilterDto } from './dto/get-tasks.dto';
import { UpdateTasksStatusDto } from './dto/update-tasks-status.dto';
import { User } from 'src/auth/user.entity';
import { TasksRepository } from './tasks.repository';

@Injectable()
export class TasksService {
    constructor(private tasksRepository: TasksRepository) {}

    getTaskById(id: string, user: User): Task {
        const userTask: Task | undefined = this.tasksRepository.getTaskById(id, user)

        if (!userTask) {
            throw new NotFoundException('Task Not Found!');
        }

        return userTask;
    }

    getAllTasks(user: User): Task[] {
        return this.tasksRepository.getAllTasks(user)
    }

    getTasksByFilter(
        getTasksDto: GetTasksFilterDto,
        user: User
    ): Task[] {
        const userTasks: Task[] = this.getAllTasks(user)
        return this.tasksRepository.getTasksByFilter(userTasks, getTasksDto)
    }

    createTask(
        createTaskDto: CreateTaskDto,
        user: User
    ): Task {
        const { title, description } = createTaskDto;

        const newTask: Task = {
            id: uuidv4(),
            userId: user.id,
            title,
            description,
            status: TasksStatus.OPEN,
        };

        this.tasksRepository.createTask(newTask);

        return newTask;
    }

    deleteTask(id: string, user: User): void {
        const userTask: Task = this.getTaskById(id, user);
        this.tasksRepository.deleteTask(userTask.id)
    }

    updateTaskStatus(
        id: string,
        updateTasksStatusDto: UpdateTasksStatusDto,
        user: User
    ): Task {
        const userTask: Task = this.getTaskById(id, user);

        this.tasksRepository.updateTaskStatus(userTask.id, updateTasksStatusDto)

        return { ...userTask, ...updateTasksStatusDto };
    }
}
