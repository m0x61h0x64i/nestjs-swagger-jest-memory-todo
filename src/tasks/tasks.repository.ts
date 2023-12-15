import { Injectable } from "@nestjs/common";
import { Task } from "./task.entity";
import { GetTasksFilterDto } from "./dto/get-tasks.dto";
import { UpdateTasksStatusDto } from "./dto/update-tasks-status.dto";
import { ITasksRepository } from "./tasks.repository.interface";

@Injectable()
export class TasksRepository implements ITasksRepository {
    private tasks: Task[] = [];

    async createOne(newTask: Task): Promise<Task> {
        this.tasks.push(newTask)
        return Promise.resolve(newTask)
    }

    async findOne(id: string, userId: string): Promise<Task | undefined> {
        return Promise.resolve(this.tasks.find((task) => task.id === id && userId === task.userId))
    }

    async findMany(userId: string): Promise<Task[]> {
        return Promise.resolve(this.tasks.filter((task) => task.userId === userId))
    }

    async search(userTasks: Task[], getTasksDto: GetTasksFilterDto): Promise<Task[]> {
        const { query, status } = getTasksDto

        let tasks: Task[] = userTasks

        if (query) {
            tasks = this.tasks.filter(
                (task) =>
                    task.title.includes(query) ||
                    task.description.includes(query),
            );
        }

        if (status) {
            tasks = this.tasks.filter((task) => task.status === status);
        }

        return Promise.resolve(tasks)
    }

    async updateOne(id: string, updateTasksStatusDto: UpdateTasksStatusDto): Promise<void> {
        const { status } = updateTasksStatusDto;
        this.tasks = this.tasks.map((task) => task.id === id ? { ...task, status } : task)
    }

    async deleteOne(id: string): Promise<void> {
        this.tasks = this.tasks.filter((task) => task.id !== id);
    }
}