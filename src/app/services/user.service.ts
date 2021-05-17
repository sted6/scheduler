/*
INDEX:
  constructor.....line 36
  getActiveUser...line 51
  getAllUsers.....line 56
  getLoggedIn.....line 61
  login...........line 71
  logout..........line 92
*/


import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // The list of users and an array containing them all
  private user1: User = { username: 'user1', password: 'password'};
  private user2: User = { username: 'user2', password: 'password'};
  private user3: User = { username: 'user3', password: 'password'};
  public users: User[] = [this.user1, this.user2, this.user3];

  // Behavior subject used to store the activeUser
  private activeUser$ = new BehaviorSubject<User>(null);
  // Behavior subject used tot store the logged in/out status
  private loggedIn$ = new BehaviorSubject<boolean>(false);

  // Fetches the logged in/out status from localStorage and the user name if isLoggedIn is 'true'
  // Compares the activeUser localStorage item to the list of users and logs in the matching user
  // Updates the isLoggedIn$ behavior subject
  constructor(private router: Router, private toast: ToastrService) {
    const loggedIn = localStorage.getItem('isLoggedIn');
    if (loggedIn === 'true') {
      const activeUsername = localStorage.getItem('activeUser');
      this.users.forEach(user => {
        if (user.username === activeUsername) {
          this.activeUser$.next(user);
          this.loggedIn$.next(true);
          return;
        }
      });
    }
  }

  // Returns the activeUser$ as an observable
  getActiveUser(): Observable<User> {
    return this.activeUser$.asObservable();
  }

  // Returns the list of users
  getAllUsers(): User[] {
    return this.users;
  }

  // Returns loggedIn$ as an observable
  getLoggedIn(): Observable<boolean> {
    return this.loggedIn$.asObservable();
  }

  // Logs the user in
  // Receives username and password parameters, both of type string
  // Compares the parameters to the list of users and their passwords and logs in the appropriate user
  // Updates the localStorage items for activeUser and isLoggedIn
  // Routes the user to the dashboard
  // If the password is incorrect, the user is shown an error message
  login(username: string, password: string): void {
    this.users.forEach(user => {
      if (username === user.username) {
        if (password === user.password) {
          this.loggedIn$.next(true);
          this.activeUser$.next(user);
          localStorage.setItem('activeUser', user.username);
          localStorage.setItem('isLoggedIn', 'true');
          this.router.navigate(['/dashboard']);
          return;
        } else {
          this.toast.error('Sorry that password was incorrect. Did you read the hint? ;)');
        }
      }
    });
  }

  // Logs the user out
  // Updates the activeUser$ to null and loggedIn$ to false
  // Removes the localStorage items activeUser and isLoggedIn
  // Routes the user to the login page
  logout(): void {
    this.activeUser$.next(null);
    this.loggedIn$.next(false);
    localStorage.removeItem('activeUser');
    localStorage.removeItem('isLoggedIn');
    this.router.navigate(['']);
  }
}
