import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {AuthInterceptor} from './auth-interceptor';
import {AppInterceptor} from '../theme/utils/app-interceptor';

export const httpInterceptorProviders = [
    {provide: HTTP_INTERCEPTORS, useClass: AppInterceptor, multi: true},
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
];
