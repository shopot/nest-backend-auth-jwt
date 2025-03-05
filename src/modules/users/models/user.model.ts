import { Exclude } from 'class-transformer';
import crypto from 'node:crypto';

export class User {
    @Exclude()
    hash: string;

    id: string;
    refreshToken: string;
    username: string;

    constructor() {
        this.id = crypto.randomUUID();
        this.refreshToken = 'undefined';
    }
}
