import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { AuthModule } from 'src/auth/auth.module';
import { TasksRepository } from './tasks.repository';

@Module({
    imports: [AuthModule],
    controllers: [TasksController],
    providers: [TasksService, TasksRepository],
})
export class TasksModule { }
