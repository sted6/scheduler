import { Component, ElementRef, ViewChild } from '@angular/core';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  // The passwordInput element reference, used to change the input type in visibilityToggled()
  @ViewChild('password') passwordInput: ElementRef;
  // The list of all users
  public users: User[];

  // The login form inputs
  public inputUsername: string;
  public inputPassword: string;

  // Injects the UserService
  // Gets the array of users from UserService.getAllUsers() sets this.users equal to it
  // Sets the inputUsername equal to the first username from the array of users
  constructor(private userService: UserService ) {
    this.users = this.userService.getAllUsers();
    this.inputUsername = this.users[0].username;
  }

  // Calls UserService.login() and passes this.inputUsername and this.inputPassword from the login form
  login(): void {
    this.userService.login(this.inputUsername, this.inputPassword);
  }

  // Toggles the visiblity of the password by changing the input type
  // Runs when the passwordVisibility checkbox from the template is toggled
  passwordVisibilityToggled(event): void {
    if (event.target.checked) {
      this.passwordInput.nativeElement.type = 'text';
    } else {
      this.passwordInput.nativeElement.type = 'password';
    }
  }

}
