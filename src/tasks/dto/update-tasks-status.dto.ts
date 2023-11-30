import { IsEnum } from 'class-validator';
import { TasksStatus } from '../tasks-status.enum';

export class UpdateTasksStatusDto {
    @IsEnum(TasksStatus)
    status: TasksStatus;
}
