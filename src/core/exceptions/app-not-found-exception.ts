import { AppBaseException } from './app-base-exception';

export class AppNotFoundException extends AppBaseException {
    constructor(description = 'Not found') {
        super('NOT FOUND', description, true);
    }
}
