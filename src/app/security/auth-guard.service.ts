import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginService } from '../services/login.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private loginService: LoginService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> |
    Promise<boolean> | boolean {
    if (this.loginService.isAuthenticated() && this.loginService.isHavePermission("Manage Employees")) 
    {
      return true;
    } 
    else 
    {
      this.router.navigate(['login'], {
        queryParams: {
          redirect: route['_routerState'].url
        }
      });
      return false;
    }
  }
}
