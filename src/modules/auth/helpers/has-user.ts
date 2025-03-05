import { Request } from 'express';

import { JwtPayload } from '../types';

export const hasUser = (req: Request): req is Request & { user: JwtPayload } => {
    return 'user' in req;
};
