import IFindAllProvidersDTO from '@modules/appointments/dtos/IFindAllProvidersDTO';
import ICreateUserDTO from '../dtos/ICreateUserDTO';
import User from '../infra/typeorm/entities/User';

export default interface IUsersRepository {
    findAllProvider(data: IFindAllProvidersDTO): Promise<User[]>;
    findById(id: string): Promise<User | undefined>;
    findByEmail(email: string): Promise<User | undefined>;
    create(data: ICreateUserDTO): Promise<User>;
    update(user: User): Promise<User>;
}
