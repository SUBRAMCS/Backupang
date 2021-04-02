import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS, HttpResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, materialize, mergeMap, dematerialize } from 'rxjs/operators';

// array in local storage for registered users
let users = JSON.parse(localStorage.getItem('users')) || [];

@Injectable({
  providedIn: 'root'
})
export class FakeBackendService implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // throw new Error("Method not implemented.");
    const {url, method, headers, body} = req;

    // wrap in delayed observable to simulate server api call
    return of(null)
    .pipe(mergeMap(handleRoute))
    .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
    .pipe(delay(500))
    .pipe(dematerialize());

    function handleRoute() {
        switch (true) {
            case url.endsWith('/authenticate') && method === 'POST':
                return authenticate();
            case url.endsWith('/otpConfirm') && method === 'POST':
                return validateOtp();
            case url.endsWith('/register') && method === 'POST':
                return register();
            case url.endsWith('/users') && method === 'GET':
                return getUsers();
            case url.endsWith('/resetpwd') && method === 'POST':
                return resetPwd();
            case url.endsWith('/changepwd') && method === 'POST':
                return changePwd();
            case url.endsWith('/getuname') && method === 'POST':
                return getUname();            
            case url.match(/\/users\/\d+$/) && method === 'DELETE':
                return deleteUser();
            default:
                // pass through any requests not handled above
                return next.handle(req);
        }    
    }

    // route functions

    function authenticate() {
        const { username, password } = body;
        const user = {id: 'acasdc', username: 'nkumar', firstName: 'Nishant', lastName: 'Kumar' };
        // const user = users.find(x => x.username === username && x.password === password);
        if (!user) return error('Username or password is incorrect');
        return ok({
            username: user.username,
            tokenId: 'fake-jwt-token'
        })
    }

    function validateOtp() {
        const { otpNo } = body;
        if(otpNo != 1234) return error ({status: 'error'});
        return ok({
            status: 'success'
        })

    }

    function resetPwd() {
        const {email} = body;
        if(email != 'abc@abc' ) return error('Invalid email-id');
        return ok();
    }

    function changePwd() {
        const {pwd} = body;
        if(pwd.length < 8) return error('Invalid password');
        return ok();
    }

    function getUname() {
        const {user} = body;
        if(user.lastName.length < 3) return error('Invalid details');
        return ok();
    }

    function register() {
        console.log('Registration data in fakebackendservice: '+JSON.stringify(body));
        const user = body

        if (users.find(x => x.username === user.username)) {
            return error('Username "' + user.username + '" is already taken')
        }

        user.id = users.length ? Math.max(...users.map(x => x.id)) + 1 : 1;
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));

        return ok();
    }

    function getUsers() {
        if (!isLoggedIn()) return unauthorized();
        return ok(users);
    }

    function deleteUser() {
        if (!isLoggedIn()) return unauthorized();

        users = users.filter(x => x.id !== idFromUrl());
        localStorage.setItem('users', JSON.stringify(users));
        return ok();
    }

    // helper functions

    function ok(body?) {
        return of(new HttpResponse({ status: 200, body }))
    }

    function error(message) {
        return throwError(message);
    }

    function unauthorized() {
        return throwError({ status: 401, error: { message: 'Unauthorised' } });
    }

    function isLoggedIn() {
        return headers.get('Authorization') === 'Bearer fake-jwt-token';
    }

    function idFromUrl() {
        const urlParts = url.split('/');
        return parseInt(urlParts[urlParts.length - 1]);
    }
    
  }

  constructor() { }
}

export const fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendService,
  multi: true
};