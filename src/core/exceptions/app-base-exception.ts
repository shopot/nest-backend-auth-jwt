export class AppBaseException extends Error {
    Exception;

    public readonly isOperational: boolean;
    public readonly name: string;

    constructor(name: string, description: string, isOperational: boolean) {
        super(description);

        Object.setPrototypeOf(this, new.target.prototype);

        this.name = name;

        this.isOperational = isOperational;

        Error.captureStackTrace(this);
    }

    public static isTrustedError(error: unknown): boolean {
        if (error instanceof AppBaseException) {
            return error.isOperational;
        }

        return false;
    }
}
