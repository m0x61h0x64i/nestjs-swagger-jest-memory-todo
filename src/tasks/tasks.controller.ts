import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-tasks.dto';
import { GetTasksFilterDto } from './dto/get-tasks.dto';
import { UpdateTasksStatusDto } from './dto/update-tasks-status.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@ApiTags('Tasks')
@ApiBearerAuth('User Access Token')
@UseGuards(AuthGuard())
@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService) { }

    @ApiOperation({ summary: 'Get Tasks' })
    @ApiOkResponse({ type: Task, isArray: true })
    @Get()
    getTasks(
        @Query(ValidationPipe) getTasksDto: GetTasksFilterDto,
        @GetUser() user: User
    ): Task[] {
        return this.tasksService.getTasksByFilter(getTasksDto, user);
    }

    @ApiOperation({ summary: 'Get Task' })
    @ApiOkResponse({ type: Task })
    @ApiNotFoundResponse({ description: 'Task Not Found!' })
    @Get(':id')
    getTaskById(
        @Param('id') id: string,
        @GetUser() user: User    
    ): Task {
        return this.tasksService.getTaskById(id, user);
    }

    @ApiOperation({ summary: 'Create Task' })
    @ApiCreatedResponse({ type: Task })
    @ApiBadRequestResponse({ description: 'Validation Error' })
    @Post()
    @UsePipes(ValidationPipe)
    createTask(
        @Body() createTaskDto: CreateTaskDto,
        @GetUser() user: User
    ): Task {
        return this.tasksService.createTask(createTaskDto, user);
    }

    @ApiOperation({ summary: 'Delete Task' })
    @ApiNotFoundResponse({ description: 'Task Not Found!' })
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    deleteTask(
        @Param('id') id: string,
        @GetUser() user: User
    ): void {
        this.tasksService.deleteTask(id, user);
    }

    @ApiOperation({ summary: 'Update Task' })
    @ApiBadRequestResponse({ description: 'Validation Error' })
    @ApiOkResponse({ type: Task })
    @Patch(':id/status')
    updateTaskStatus(
        @Param('id') id: string,
        @Body('status') updateTasksStatusDto: UpdateTasksStatusDto,
        @GetUser() user: User
    ): Task {
        return this.tasksService.updateTaskStatus(id, updateTasksStatusDto, user);
    }
}
