import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthenticateService } from '../services/authenticate.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    exemptUrls: string[] = ['register', 'forgotPassword', 'resetPassword', 'authenticate','forgotLogin'];
    constructor(private authenticationService: AuthenticateService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        request.url.replace('.[\\]$', '');
        
        // add authorization header with jwt token if available
        let currentUser = this.authenticationService.currentUserValue;
        let exempt = false;
        this.exemptUrls.forEach( url => {
            exempt = request.url.indexOf(url) == -1 ? exempt : true;
        })
        if (!exempt && currentUser ) {
            request = request.clone({
                setHeaders: { 
                    Authorization: `Bearer ${currentUser}`
                }
            });
        }

        return next.handle(request);
    }
}