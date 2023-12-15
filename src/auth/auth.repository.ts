import { Injectable } from "@nestjs/common";
import { User } from "./user.entity";
import { IAuthRepository } from "./auth.repository.interface";

@Injectable()
export class AuthRepository implements IAuthRepository {
    private users: User[] = []

    async createOne(newUser: User): Promise<User> {
        this.users.push(newUser)
        return Promise.resolve(newUser)
    }

    async findOne(username: string): Promise<User | undefined> {
        return Promise.resolve(this.users.find(
            (user: User) => user.username === username
        ))
    }
}