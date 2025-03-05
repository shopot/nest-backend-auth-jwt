export class CreateUserDto {
    readonly hash: string;
    readonly username: string;
}

export class UpdateUserDto {
    readonly id: string;
    readonly refreshToken?: string;
}
