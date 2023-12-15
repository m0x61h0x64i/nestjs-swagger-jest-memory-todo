import { User } from "./user.entity";

export interface IAuthRepository {
    createOne(newUser: User): Promise<User>
    findOne(username: string): Promise<User | undefined>
}