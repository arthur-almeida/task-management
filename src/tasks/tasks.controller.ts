import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CreateTaskDto, GetTasksFilterDto, UpdateTaskStatusDto } from './dtos';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  public getTasks(
    @Query() filterDto: GetTasksFilterDto,
    @GetUser() user: User,
  ) {
    return this.tasksService.getTasks(filterDto, user);
  }

  @Get(':id')
  public getTaskById(@Param('id') id: string, @GetUser() user: User) {
    return this.tasksService.getTaskById(id, user);
  }

  @Post()
  public createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ) {
    return this.tasksService.createTask(createTaskDto, user);
  }

  @Delete(':id')
  public deleteTask(@Param('id') id: string) {
    return this.tasksService.deleteTask(id);
  }

  @Patch(':id/status')
  public updateTaskStatus(
    @Param('id') id: string,
    @Body() { status }: UpdateTaskStatusDto,
    @GetUser() user: User,
  ) {
    return this.tasksService.updateTaskStatus(id, status, user);
  }
}
