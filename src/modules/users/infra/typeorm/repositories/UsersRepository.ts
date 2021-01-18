import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import { getRepository, Repository } from 'typeorm';
import User from '../entities/User';

export default class UsersRepository implements IUsersRepository {
    private ormRepository: Repository<User>;

    constructor() {
        this.ormRepository = getRepository(User);
    }

    public async findById(id: string): Promise<User | undefined> {
        return this.ormRepository.findOne(id);
    }

    public async findByEmail(email: string): Promise<User | undefined> {
        return this.ormRepository.findOne({ where: { email } });
    }

    public async create(data: ICreateUserDTO): Promise<User> {
        const user = this.ormRepository.create(data);
        await this.ormRepository.save(user);
        return user;
    }

    public async update(user: User): Promise<User> {
        await this.ormRepository.save(user);
        return user;
    }
}
