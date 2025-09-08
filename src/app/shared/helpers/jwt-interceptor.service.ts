import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class JwtInterceptorService implements HttpInterceptor {
    constructor(private router: Router) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        // console.log('Interceptor - current User:' + currentUser);
        let token = localStorage.getItem('token');
        //console.log('Interceptor - token:' + token);
        if (currentUser && token) {
            request = request.clone({
                setHeaders: {
                    'Authorization': `Bearer ${token}`
                }
            });
        }

        //return next.handle(request);
        return next.handle(request).pipe(tap(() => { },
            (err: any) => {
                if (err instanceof HttpErrorResponse) {
                    if (err.status !== 401) {
                        return;
                    }                    
                    this.router.navigate(['/sessions/signin']);
                }
            }));

    }
}
