import { TasksStatus } from './tasks-status.enum';

export class Task {
    id: string;
    userId: string;
    title: string;
    description: string;
    status: TasksStatus;
}
