import { Injectable, NotFoundException } from '@nestjs/common';
import { Task as TaskModel, TaskStatus } from './task.model';
import { CreateTaskDto, GetTasksFilterDto } from './dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  private tasks: TaskModel[] = [];

  constructor(
    @InjectRepository(Task) private readonly tasksRepository: Repository<Task>,
  ) {}

  public getAllTasks(): TaskModel[] {
    return this.tasks;
  }

  public getTasksWithFilters({
    status,
    search,
  }: GetTasksFilterDto): TaskModel[] {
    let tasks = this.getAllTasks();
    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }
    if (search) {
      tasks = tasks.filter((task) => {
        if (task.title.includes(search) || task.description.includes(search)) {
          return true;
        }
        return false;
      });
    }
    return tasks;
  }

  public async getTaskById(id: string): Promise<Task> {
    const task = await this.tasksRepository.findOneBy({
      id,
    });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  public async createTask({
    title,
    description,
  }: CreateTaskDto): Promise<Task> {
    const task = this.tasksRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });
    await this.tasksRepository.save(task);
    return task;
  }

  public async deleteTask(id: string) {
    const deleteResult = await this.tasksRepository.delete(id);
    if (deleteResult.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }

  public async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;
    return task;
  }
}
