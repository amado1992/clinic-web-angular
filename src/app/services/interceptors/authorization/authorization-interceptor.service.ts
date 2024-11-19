import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginService } from '../../login.service';



@Injectable()
export class AuthorizationInterceptorService implements HttpInterceptor {

  constructor(private router: Router, private loginService: LoginService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const securityToken = localStorage.getItem('usertoken');
    if (securityToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${securityToken}`,
        }
      });
    }
    return next.handle(request).pipe(
      tap(
        event => {},
        error => {
          if (error instanceof HttpErrorResponse) {
            if (error.status === 401 && this.router.url.indexOf('/login') < 0) {
              this.loginService.logout();
              this.router.navigate(['/login'], {
                queryParams: {
                  redirect: this.router.url
                }
              });
            }
          }
        }
      )
    );
  }
}
