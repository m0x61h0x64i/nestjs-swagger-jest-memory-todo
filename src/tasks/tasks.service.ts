import { Injectable, NotFoundException } from '@nestjs/common';
import { TasksStatus } from './tasks-status.enum';
import { Task } from './task.entity';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDto } from './dto/create-tasks.dto';
import { GetTasksFilterDto } from './dto/get-tasks.dto';
import { UpdateTasksStatusDto } from './dto/update-tasks-status.dto';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    getTaskById(id: string, user: User): Task {
        const task: Task | undefined = this.tasks.find(
            (task) => task.id === id && task.userId === user.id,
        );

        if (!task) {
            throw new NotFoundException('Task Not Found!');
        }

        return task;
    }

    getAllTasks(user: User): Task[] {
        return this.tasks.filter((task) => task.userId === user.id);
    }

    getTasksByFilter(
        getTasksDto: GetTasksFilterDto,
        user: User
    ): Task[] {
        const { search, status } = getTasksDto;

        let tasks: Task[] = this.getAllTasks(user);

        if (search) {
            tasks = tasks.filter(
                (task) =>
                    task.title.includes(search) ||
                    task.description.includes(search),
            );
        }

        if (status) {
            tasks = tasks.filter((task) => task.status === status);
        }

        return tasks;
    }

    createTask(
        createTaskDto: CreateTaskDto,
        user: User
    ): Task {
        const { title, description }: CreateTaskDto = createTaskDto;

        const newTask: Task = {
            id: uuidv4(),
            userId: user.id,
            title,
            description,
            status: TasksStatus.OPEN,
        };
        this.tasks.push(newTask);

        return newTask;
    }

    deleteTask(id: string, user: User): void {
        const foundTask: Task = this.getTaskById(id, user);

        if (!foundTask) {
            throw new NotFoundException('Task Not Found!')
        }

        this.tasks = this.tasks.filter((task) => task.id !== foundTask.id);
    }

    updateTaskStatus(
        id: string,
        updateTasksStatusDto: UpdateTasksStatusDto,
        user: User
    ): Task {
        const { status }: UpdateTasksStatusDto = updateTasksStatusDto;
        const task: Task = this.getTaskById(id, user);
        const taskIndex: number = this.tasks.findIndex(
            (task) => task.id === id,
        );

        if (!task) {
            throw new NotFoundException('Task Not Found!')
        }

        task.status = status;
        this.tasks.splice(taskIndex, 1, task);
        return task;
    }
}
