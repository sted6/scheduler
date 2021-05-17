/*
  Protects the login page
  Gets the current value of UserService.isLoggedIn
  If it's false (user is not already logged in), the user is redirected to the login page
  If it's true (user is already logged in), the use ris allowed to visit the dashboard
*/

import { UserService } from '../services/user.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DashboardGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.userService.getLoggedIn().pipe(
        map(isLoggedIn => {
          if (!isLoggedIn) {
            this.router.navigate(['']);
            return false;
          }
          return true;
        })
      );
    }
}
