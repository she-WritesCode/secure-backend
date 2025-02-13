import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import { CreateGuestUserDto } from './dto/create-guest-user.dto';
import { Role } from 'src/common/enums/role.enum';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto) {
    return this.userRepository.create(createUserDto);
  }

  async findAll(query: Record<string, any> = {}) {
    return this.userRepository.find(query);
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({ _id: id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async createGuestUser(dto: CreateGuestUserDto) {
    const temporaryPassword = Math.random().toString(36).slice(-8);
    const [user] = await this.userRepository.findOrCreate(
      { email: dto.email },
      {
        name: dto.name,
        phoneNumber: dto.phoneNumber,
        email: dto.email,
        password: temporaryPassword,
        isActive: false,
        role: Role.CUSTOMER,
      },
    );
    return user;
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({ email });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userRepository.findOneAndUpdate(
      { _id: id },
      updateUserDto,
    );
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updatedUser;
  }

  async remove(id: string) {
    const deletedUser = await this.userRepository.deleteOne({ _id: id });
    if (!deletedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return deletedUser;
  }
}
