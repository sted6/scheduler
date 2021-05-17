# Scheduler Application Overview

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.2.0.

The application allows users to request and confirm or deny appointments with other users as well as request and confirm cancellations for confirmed appointments.

When first creating an appointment it will populate under "Pending Appointments" on the dashboard. A pending appointment will only confirmed when the invited user confirms the appointment from their dashboard.

The user who creates the appointment may cancel it before the invited user confirms it.

Once confirmed, the apointment will move from "Pending Appointments" to "Appointments" and can only be cancelled (deleted) when a user requests it and the other attending user accepts the request.

When a user requests an appointment be cancelled, it will move from "Appointments" to "Appointments Pending Cancellation" where they can cancel the cancellation request (return the appointment to the confirmed appointments list) 
and the other attending user can accept or decline the request to cancel.

Pending appointments can also be declined. Once declined, for the guest (invited user) the appointment will be deleted. For the host (appointment creator) the appointment will move from "Pending Appointments" to "Declined Appointments" where it can then be permanently deleted.

The view for each set of appointments can be toggled between a block view and a table view.

## Architecture

FRONT END
  Modules
    [AppModule](src/app/app.module.ts) - root module, declares all three components
    [AppRoutingModule](src/app/app-routing.module.ts) - manages the routes and routing logic, implements the route guards

  Components
    [App](src/app) - root component, parent to [Login] and [Dashboard] - contains the nav bar and the main router outlet
      [Login](src/app/components/login) - child to [App], sibling to [Dashboard] - logs the user in using the UserService, contains login form
      [Dashboard](src/app/components/dashboard) - child to [App], sibling to [Login] - contains all logic for interacting with the cloud functions and the primary functionality and UI of the application

  Models
    [UserModel](src/app/models/user.model.ts) - simple interface for type checking the users
    [AppointmentModel](src/app/models/appointment.model.ts) - model class used for instantiating new appointment objects and type checking

  Services
    [UserService](src/app/services/user.service.ts) - holds user data, manages loggedIn state and the active user

  Guards
    [LoginGuard](src/app/guards/login.guard.ts) - prevents already logged in users from viewing the login page
    [DashboardGuard](src/app/guards/dashboard.guard.ts) - prevents users not logged in from viewing the dashboard page

  Validators
    [DateDirective](src/app/validators/invalid-date.directive.ts) - validates that the date is not in the past or too far in the future
    [InvalidTimesDirective](src/app/validators/invalid-times.directive.ts) - validates that the new appointment start time is before the end time

  Important 3rd Party Packages
    [AngularFireFunctions](https://github.com/angular/angularfire/blob/master/docs/functions/functions.md)
    [ngx-toastr](https://github.com/scttcper/ngx-toastr/blob/master/README.md)
    [ngx-bootstrap](https://github.com/valor-software/ngx-bootstrap/blob/development/README.md)

  Environment
    [Environment](src/app/environments/environment.ts) - holds firebase config including the api key

BACK END
  Cloud Functions
    [Index](functions/src/index.ts) - contains all cloud functions for interacting with the firebase firestore database

## Development server

Run `npm install` from the root first as all node_modules have been deleted

Run `npm install` from the functions folder next

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

Run `firebase emulators:start` for emulated firestore, function, and hosting funtionality. Navigate to http://localhost:4000/functions to view function logs and http://localhost:4000/firestore to view and manipulate data in the emulated firestore database.

You must run all three commands to test the application.

Run `ng build` then `firebase deploy` if you've updated the cloud functions in the [CloudFunctions](functions/src/index.ts) file

## Suggested Instructions for Use

1. After starting the development server process outlined above, begin by logging in to one of the user accounts using the password "password" (it's the same for all three users).

2. Create your first appointment by clicking the "Add Appointment" button, filling out the required information in the modal that opens, and clicking "Send Invite".

3. Repeat step 2 four more times.

4. Cancel one of the pending appointments.

5. Log out by clicking on the drop down menu in the top right corner, and log into the user account which you invited.

6. Decline one of the appointment invitation, accept two of the invitations, and leave the other in 'Pending'.

7. Log out, and log back into the first user which you were logged in as.

8. You should now have two confirmed appointments, one pending appointment, and one declined appointment.

9. View the appointments in table view.

10. Request a cancellation of one of the confirmed appointments. You should now have one appointment in each of the different appointment types.

11. Delete the declined request.

12. Log out, and log back in as the other user you've been interacting as. Decline the cancellation request.

13. Request the appointment be cancelled again from the user you're currently logged in as. Cancel the request, and then request it once more.

14. Log out, and log back in as the other user you've been interacting as. Accept the cancellation request.

15. Congratulations! You have successfully sampled everything this little app has to offer.


## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

NOTE: This project currently has no tests.

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

NOTE: This project currently has no tests.

## Further help

To get more help using or testing the application, please contact [Matt Mittelsted](https://sted6.github.io)(https://www.linkedin.com/in/matthew-m-39b475169/) by emailing him at mattmittelsted@gmail.com.

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## TODO
  1. Implement real user authentication and replace the hokey simulated authentication currently in place
  2. Write firebase rules in line with the authentication
  3. Build back end logic to prevent race conditions
  4. Allow users to invite more than one user to their appointments
  5. Implement confirmations for user actions
  6. Order appointments by start date
  7. Design and implement a better looking UI
