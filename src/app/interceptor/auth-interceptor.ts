import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    public currentUser = JSON.parse(localStorage.getItem('currentUser'));

    constructor() {}

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        // Get the auth token from the service.
        // const authToken = this.auth.getAuthorizationToken();

        // Clone the request and replace the original headers with
        // cloned headers, updated with the authorization.
        if (this.currentUser) {
            const authReq = req.clone({
                headers: req.headers.set('Authorization', 'Bearer ' + this.currentUser.access_token)
            });

            // send cloned request with header to the next handler.
            return next.handle(authReq);
        } else {
            return next.handle(req);
        }
    }
}