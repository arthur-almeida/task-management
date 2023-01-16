import { Injectable, NotFoundException } from '@nestjs/common';
import { Task as TaskModel, TaskStatus } from './task.model';
import { randomUUID } from 'node:crypto';
import { CreateTaskDto, GetTasksFilterDto } from './dtos';

@Injectable()
export class TasksService {
  private tasks: TaskModel[] = [];

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

  public getTaskById(id: string): TaskModel | undefined {
    const task = this.tasks.find((task) => task.id === id);
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  public createTask({ title, description }: CreateTaskDto): TaskModel {
    const task: TaskModel = {
      id: randomUUID(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }

  public deleteTask(id: string) {
    const taskToBeDeleted = this.getTaskById(id);
    this.tasks = this.tasks.filter((task) => task.id !== taskToBeDeleted.id);
  }

  public updateTaskStatus(id: string, status: TaskStatus): TaskModel {
    const task = this.getTaskById(id);
    task.status = status;
    return task;
  }
}
