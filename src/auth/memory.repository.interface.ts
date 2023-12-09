import { User } from "./user.entity";

export interface IUserRepository {
    createOne(newUser: User): Promise<User>
    findOne(username: string): Promise<User | undefined>
}