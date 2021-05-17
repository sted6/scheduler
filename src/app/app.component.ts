import { Subject } from 'rxjs';
import { UserService } from './services/user.service';
import { Component, OnDestroy } from '@angular/core';
import { User } from './models/user.model';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  // Used to force subscription to unsubscribe preventing data leak
  private readonly onDestroy = new Subject<void>();

  // The currently logged in user
  public activeUser: User;

  // Injects the UserService
  // Subscribes to UserService.getActiveUser() and set the active user
  constructor(private userService: UserService){
    this.userService.getActiveUser().pipe(takeUntil(this.onDestroy)).subscribe(user => {
      this.activeUser = user;
    });
  }

  // Runs when the component is destroyed
  // Forces subscription to unsubscribe
  ngOnDestroy(): void {
    this.onDestroy.next();
  }

  // Calls the UserService.logout() function to log the user out
  logout(): void{
    this.userService.logout();
  }
}
