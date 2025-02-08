import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AbstractRepository } from 'src/common/database/abstract.repository';
import { User } from './schemas/user.schema';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';

@Injectable()
export class UserRepository extends AbstractRepository<
  User,
  CreateUserDto,
  UpdateUserDto
> {
  protected logger = new Logger(UserRepository.name);

  constructor(
    @InjectModel(User.name) model: Model<User>,
    @InjectConnection() connection: Connection,
  ) {
    super(model, connection);
  }

  protected searchableFields: (keyof User)[] = ['name', 'email', 'phoneNumber'];
  protected excludedFields: string[] = [];
  protected populateOnFind: string[] = [];
}
