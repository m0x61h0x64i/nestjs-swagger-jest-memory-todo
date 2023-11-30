import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [AuthModule],
    controllers: [TasksController],
    providers: [TasksService],
})
export class TasksModule { }