import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async create(
        email: string,
        password: string,
        name: string,
        role: string,
    ) {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = this.userRepository.create({
            email,
            password: hashedPassword,
            name,
            role: role || 'buyer',
        });

        return this.userRepository.save(user);
    }

    async findByEmail(email: string) {
        return this.userRepository.findOne({ where: { email } });
    }
}
