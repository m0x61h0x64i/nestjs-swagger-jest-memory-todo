import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { TasksStatus } from '../tasks-status.enum';

export class GetTasksFilterDto {
    @IsOptional()
    @IsNotEmpty()
    search: string;

    @IsOptional()
    @IsEnum(TasksStatus)
    status: string;
}
