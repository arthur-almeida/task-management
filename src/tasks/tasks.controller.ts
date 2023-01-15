import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateTaskDto } from './dtos';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  public getAllTasks() {
    return this.tasksService.getAllTasks();
  }

  @Post()
  public createTask(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.createTask(createTaskDto);
  }
}
