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
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from "../auth/user.entity";
import { NotFoundSwagger } from '../swagger/not-found.swagger';
import { BadRequestSwagger } from '../swagger/bad-request.swagger';
import { GetUser } from '../auth/get-user.decorator';

@ApiTags('Tasks')
@ApiBearerAuth('User Access Token')
@UseGuards(AuthGuard())
@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService) { }

    @ApiOperation({ summary: 'Create a task' })
    @ApiCreatedResponse({ description: 'OK', type: Task })
    @ApiBadRequestResponse({ description: 'Validation Error', type: BadRequestSwagger })
    @Post()
    @UsePipes(ValidationPipe)
    async createTask(
        @Body() createTaskDto: CreateTaskDto,
        @GetUser() user: User
    ): Promise<Task> {
        return await this.tasksService.createTask(createTaskDto, user.id);
    }

    @ApiOperation({ summary: 'Get a task by id' })
    @ApiOkResponse({ description: 'OK', type: Task })
    @ApiNotFoundResponse({ description: 'Task Not Found!', type: NotFoundSwagger })
    @Get(':id')
    async getTaskById(
        @Param('id') id: string,
        @GetUser() user: User
    ): Promise<Task> {
        return await this.tasksService.getTaskById(id, user.id);
    }

    @ApiOperation({ summary: 'Get all tasks' })
    @ApiOkResponse({ description: 'OK', type: Task, isArray: true })
    @Get()
    async getAllTasks(
        @GetUser() user: User
    ): Promise<Task[]> {
        return await this.tasksService.getAllTasks(user.id);
    }

    @ApiOperation({ summary: 'Search tasks' })
    @ApiOkResponse({ description: 'OK', type: Task, isArray: true })
    @Get('search')
    async getTasksByFilter(
        @Query(ValidationPipe) getTasksFilterDto: GetTasksFilterDto,
        @GetUser() user: User
    ): Promise<Task[]> {
        return await this.tasksService.getTasksByFilter(getTasksFilterDto, user.id);
    }

    @ApiOperation({ summary: 'Delete a task' })
    @ApiNoContentResponse({ description: 'OK' })
    @ApiNotFoundResponse({ description: 'Task Not Found!', type: NotFoundSwagger })
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    async deleteTask(
        @Param('id') id: string,
        @GetUser() user: User
    ): Promise<void> {
        await this.tasksService.deleteTask(id, user.id);
    }

    @ApiOperation({ summary: 'Update a task status' })
    @ApiBadRequestResponse({ description: 'Validation Error', type: BadRequestSwagger })
    @ApiOkResponse({ description: 'OK', type: Task })
    @Patch(':id/status')
    async updateTaskStatus(
        @Param('id') id: string,
        @Body('status') updateTasksStatusDto: UpdateTasksStatusDto,
        @GetUser() user: User
    ): Promise<Task> {
        return await this.tasksService.updateTaskStatus(id, updateTasksStatusDto, user.id);
    }
}
