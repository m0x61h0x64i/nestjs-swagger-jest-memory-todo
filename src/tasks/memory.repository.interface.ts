import { Task } from './task.entity';
import { GetTasksFilterDto } from './dto/get-tasks.dto';
import { UpdateTasksStatusDto } from './dto/update-tasks-status.dto';

export interface ITasksRepository {
    createOne(newTask: Task): Promise<Task>;
    findOne(id: string, userId: string): Promise<Task | undefined>;
    findMany(userId: string): Promise<Task[]>;
    search(userTasks: Task[], getTasksDto: GetTasksFilterDto): Promise<Task[]>;
    deleteOne(id: string): Promise<void>;
    updateOne(id: string, updateTasksStatusDto: UpdateTasksStatusDto): Promise<void>;
}