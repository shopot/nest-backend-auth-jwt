import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    getProtectedRoute(): string {
        return 'Public route no need for the authentification it call access without login.';
    }

    getPublicRoute(): string {
        return 'So the public data are accessible via public routes.';
    }
}
