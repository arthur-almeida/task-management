import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from './dtos/auth-credentials.dto';
import { User } from './user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async createUser({ username, password }: AuthCredentialsDto): Promise<void> {
    const user = this.usersRepository.create({
      username,
      password,
    });
    await this.usersRepository.save(user);
  }
}
