import { Injectable, NotFoundException } from '@nestjs/common';
import { TransformInstanceToPlain } from 'class-transformer';

import { User } from '#modules/users';

import { CreateUserDto, UpdateUserDto } from './users.dto';

const users: User[] = [
    {
        hash: '$2b$10$FtpO2MHxgiSRZxodaCYdp.JWXTOCR89MQmrYhLR1eRQvCB2dNjkw6', // test
        id: '0724badb-073f-4206-8491-683267e14d67',
        refreshToken: 'undefined',
        username: 'admin',
    },
];

@Injectable()
export class UsersService {
    @TransformInstanceToPlain()
    async create(dto: CreateUserDto): Promise<User> {
        const user = new User();

        user.username = dto.username;

        user.hash = dto.hash;

        return Promise.resolve(user);
    }

    async findOne({ id, username }: { id?: string; username?: string }) {
        let user: undefined | User = undefined;

        if (id) {
            user = users.find((user) => user.id === id);
        } else if (username) {
            user = users.find((user) => user.username === username);
        }

        if (!user) {
            throw new NotFoundException('User not found.');
        }

        return Promise.resolve(user);
    }

    async update({ id, ...dto }: UpdateUserDto) {
        const index = users.findIndex((user) => user.id === id);

        if (index === -1) {
            throw new NotFoundException('User not found.');
        }

        users[index] = {
            ...users[index],
            ...dto,
        };

        return Promise.resolve(users[index]);
    }
}
