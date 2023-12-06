import { Injectable } from "@nestjs/common";
import { Task } from "./task.entity";
import { User } from "src/auth/user.entity";
import { GetTasksFilterDto } from "./dto/get-tasks.dto";
import { UpdateTasksStatusDto } from "./dto/update-tasks-status.dto";

@Injectable()
export class TasksRepository {
    private tasks: Task[] = [];

    getTaskById(id: string, user: User): Task | undefined {
        return this.tasks.find((task) => task.id === id && user.id === task.userId)
    }

    getAllTasks(user: User): Task[] {
        return this.tasks.filter((task) => task.userId === user.id)
    }

    getTasksByFilter(userTasks: Task[], getTasksDto: GetTasksFilterDto): Task[] {
        const { search, status } = getTasksDto

        let tasks: Task[] = userTasks

        if (search) {
            tasks = this.tasks.filter(
                (task) =>
                    task.title.includes(search) ||
                    task.description.includes(search),
            );
        }

        if (status) {
            tasks = this.tasks.filter((task) => task.status === status);
        }

        return tasks
    }

    createTask(newTask: Task): void {
        this.tasks.push(newTask)
    }

    deleteTask(id: string): void {
        this.tasks = this.tasks.filter((task) => task.id !== id);
    }

    updateTaskStatus(id: string, updateTasksStatusDto: UpdateTasksStatusDto): void {
        const { status } = updateTasksStatusDto;
        this.tasks = this.tasks.map((task) => task.id === id ? { ...task, status } : task)
    }
}