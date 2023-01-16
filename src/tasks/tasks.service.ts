import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto, GetTasksFilterDto } from './dtos';
import { Task } from './task.entity';
import { TaskStatus } from './task.model';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly tasksRepository: Repository<Task>,
  ) {}

  public async getTasks({
    status,
    search,
  }: GetTasksFilterDto): Promise<Task[]> {
    const queryBuilder = this.tasksRepository.createQueryBuilder('task');
    if (status) {
      queryBuilder.andWhere('task.status = :status', { status });
    }
    if (search) {
      queryBuilder.andWhere(
        'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
        { search: `%${search.toLowerCase()}%` },
      );
    }
    const tasks = await queryBuilder.getMany();
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
    await this.tasksRepository.save(task);
    return task;
  }
}
