import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { randomUUID } from 'node:crypto';
import { CreateTaskDto } from './dtos';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  public getAllTasks(): Task[] {
    return this.tasks;
  }

  public getTaskById(id: string): Task | undefined {
    return this.tasks.find((task) => task.id === id);
  }

  public createTask({ title, description }: CreateTaskDto): Task {
    const task: Task = {
      id: randomUUID(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }

  public deleteTask(id: string) {
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }
}
