/*
TODO:
  2. Add functionallity to alert users when they have new or declined requests since their last login
  3. Add functionallity to allow multiple guests

INDEX:
  constructor..........................................................................................line 97
    -set active user and other users
  ngOnInit.............................................................................................line 111
    -fetch user's appointments: confirmed, pending cancellation, pending, and declined
  ngOnDestroy..........................................................................................line 119
    -force all subscriptions to unsubscribe to prevent data leaks
  fetchAppointments....................................................................................line 127
    -fetch user's confirmed appointments
  fetchAppointmentsPendingCancellation.................................................................line 144
    -fetch user's confirmed appointments with an active cancellation request
  fetchPendingAppointments.............................................................................line 162
    -fetch user's appointments not yet accepted or declined by the guest
  fetchDeclinedAppointments............................................................................line 178
    -fetch appointments that were declined and user was the host
  createPendingAppointment.............................................................................line 200
    -create a new pending appointment/send appointment invite
  confirmAppointment...................................................................................line 239
    -confirm a pending appointment
  declinePendingAppointment............................................................................line 260
    -decline a pending appointment (when user is guest)
  cancelPendingAppointment.............................................................................line 280
    -cancel a pending appointment (when user is host)
  requestCancellation..................................................................................line 301
    -request that a confirmed appointment be cancelled
  confirmCancellation..................................................................................line 323
    -confirm/accept a cancellation request
  declineCancellation..................................................................................line 345
    -decline/cancel a cancellation request
  deleteDeclinedAppointment............................................................................line 368
    -permanently delete a declined appointment
  openModal............................................................................................line 382
*/

import { ToastrService } from 'ngx-toastr';
import { Appointment } from '../../models/appointment.model';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { Subject, Subscription } from 'rxjs';
import { UserService } from '../../services/user.service';
import { takeUntil } from 'rxjs/operators';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  // A reference to assign to the modal when opening it
  modalRef: BsModalRef;
  // The modal configuration
  private modalConfig = {
    keyboard: true
  };
  // Used in ngOnDestroy to force all subscriptions to terminate to prevent data leaks
  private readonly onDestroy = new Subject<void>();

  // The currently active user
  private activeUser: User;
  // All users besides the currently active user
  public otherUsers: User[];
  // All of the users confirmed appointments
  public appointments: Appointment[] = [];
  // All of the users pending appointments
  public pendingAppointments: Appointment[] = [];
  // All of the users declined appointments
  public declinedAppointments: Appointment[] = [];
  // All of the users appointments pending cancellation
  public appointmentsPendingCancellation: Appointment[] = [];

  // Variables used to toggle the appointment views
  public confirmedTableview = false;
  public pendingCancellationTableview = false;
  public pendingTableview = false;
  public declinedTableview = false;

  // New appointment variables
  public inputTitle: string;
  public inputDescription: string;
  public inputDate: string;
  public inputStartTime: string;
  public inputEndTime: string;
  public inputGuest: string;


  // Injects the UserService, FireFunctions, and ToastrService for use throughout the component
  // Subscribes to UserService.getActiveUser() to set the currently activeUser
  // Calls UserService.getAllUsers() and filters the returned users to remove the activeUser, used to populate the guest select input
  // Sets this.inputGuest equal to the first user remaining in the otherUsers array so the guest select will be prepopulated
  constructor(
    private userService: UserService,
    private fireFunctions: AngularFireFunctions,
    private toast: ToastrService,
    private modalService: BsModalService
    ) {
    this.userService.getActiveUser().pipe(takeUntil(this.onDestroy)).subscribe(user => {
          this.activeUser = user;
    });
    this.otherUsers = this.userService.getAllUsers().filter(user => user !== this.activeUser);
    this.inputGuest = this.otherUsers[0].username;
  }

  // Fetches the user's confirmed appointments, appointments pending cancellation, pending appointments, and declined appointments
  ngOnInit(): void {
    this.fetchAppointments();
    this.fetchAppointmentsPendingCancellation();
    this.fetchPendingAppointments();
    this.fetchDeclinedAppointments();
  }

  // Runs when the component is destroyed, this.onDestroy.next() is used to force all subscriptions to terminate
  ngOnDestroy(): void {
    this.onDestroy.next();
  }

  // Fetch the user's confirmed appointments
  // Subscribes to fetchAppointments in the functions/src/index.ts file and passes the active user's username
  // Populates the this.appointments array with the returned appointments
  // .pipe(takeUntil(this.onDestroy)) is used to ensure there are no data leaks, onDestroy is called within ngOnDestroy()
  fetchAppointments(): Subscription {
    this.appointments = [];
    const callable = this.fireFunctions.httpsCallable('fetchAppointments');
    const fetchAppointmentsAction = callable(this.activeUser.username).pipe(takeUntil(this.onDestroy)).subscribe(data => {
      data.forEach(element => {
        // Line below this comment adds the id to the appointment for later use
        element[1].id = element[0];
        this.appointments.push(element[1]);
      });
    });
    return fetchAppointmentsAction;
  }

  // Fetch the user's appointments pending cancellation
  // Subscribes to fetchAppointmentsPendingCancellation in the functions/src/index.ts file and passes the active user's username
  // Populates the this.appointmentsPendingCancellation array with the returned appointments
  // .pipe(takeUntil(this.onDestroy)) is used to ensure there are no data leaks, onDestroy is called within ngOnDestroy()
  fetchAppointmentsPendingCancellation(): Subscription {
    this.appointmentsPendingCancellation = [];
    const callable = this.fireFunctions.httpsCallable('fetchAppointmentsPendingCancellation');
    const fetchAppointmentsPendingCancellationAction = callable(this.activeUser.username)
      .pipe(takeUntil(this.onDestroy)).subscribe(data => {
      data.forEach(element => {
        // Line below this comment adds the id to the appointment for later use
        element[1].id = element[0];
        this.appointmentsPendingCancellation.push(element[1]);
      });
    });
    return fetchAppointmentsPendingCancellationAction;
  }

  // Fetch the user's pending appointments
  // Subscribes to fetchPendingAppointments in the functions/src/index.ts file and passes the active user's username
  // Populates the this.pendingAppointments array with the returned appointments
  // .pipe(takeUntil(this.onDestroy)) is used to ensure there are no data leaks, onDestroy is called within ngOnDestroy()
  fetchPendingAppointments(): Subscription {
    this.pendingAppointments = [];
    const callable = this.fireFunctions.httpsCallable('fetchPendingAppointments');
    const fetchPendingAppointmentsAction = callable(this.activeUser.username).pipe(takeUntil(this.onDestroy)).subscribe(data => {
      data.forEach(element => {
        element[1].id = element[0];
        this.pendingAppointments.push(element[1]);
      });
    });
    return fetchPendingAppointmentsAction;
  }

  // Fetch the user's declined appointments
  // Subscribes to fetchDeclinedAppointments in the functions/src/index.ts file and passes the active user's username
  // Populates the this.declinedAppointments array with the returned appointments
  // .pipe(takeUntil(this.onDestroy)) is used to ensure there are no data leaks, onDestroy is called within ngOnDestroy()
  fetchDeclinedAppointments(): Subscription {
    this.declinedAppointments = [];
    const callable = this.fireFunctions.httpsCallable('fetchDeclinedAppointments');
    const fetchDeclinedAppointmentsAction = callable(this.activeUser.username).pipe(takeUntil(this.onDestroy)).subscribe(data => {
      data.forEach(element => {
        element[1].id = element[0];
        this.declinedAppointments.push(element[1]);
      });
    });
    return fetchDeclinedAppointmentsAction;
  }

  // Create a new pending appointment
  // Receives a form parameter of any type (should be a form but Form cannot be reset programmatically here)
  // Converts input from start and end times to dates then gets the time and divides by 1000 to get the seconds for...
  // converting to google cloud timestamp in the functions/src/index.ts file
  // Uses the newly created variables containing the start and end time seconds, as well as...
  // all inputs from the newAppointment form store in class variables to create a new appointment object
  // Calls createNewPendingAppointment in the functions/src/index.ts file and passes the newly created appointment
  // If there is a response, the user is show a sucess message, the pending appointments are refetched, the form is reset and closed
  // If there is no response or the response is false (set up in the functions/src/index.ts file), the user is shown an error message
  // .pipe(takeUntil(this.onDestroy)) is used to ensure there are no data leaks, onDestroy is called within ngOnDestroy()
  createNewPendingAppointment(form): Subscription {
    if (form.invalid) {
      Object.keys(form.controls).forEach(key => {
        form.controls[key].markAsTouched();
      });
      return;
    }
    const startDatetime = new Date(this.inputDate + ' ' + this.inputStartTime).getTime() / 1000;
    const endDatetime = new Date(this.inputDate + ' ' + this.inputEndTime).getTime() / 1000;
    const appointment = new Appointment(
      this.inputTitle,
      this.inputDescription,
      startDatetime,
      endDatetime,
      this.activeUser.username,
      this.inputGuest
      );
    const callable = this.fireFunctions.httpsCallable('createNewPendingAppointment');
    const createNewPendingAppointmentAction = callable(appointment).pipe(takeUntil(this.onDestroy)).subscribe(data => {
      if (data) {
        this.toast.success('Appointment Inivitation has been sent.');
        this.fetchPendingAppointments();
        form.reset();
        this.modalRef.hide();
      } else {
        this.toast.error('Failed to send the appointment invitation, please try again later.');
      }
    });
    return createNewPendingAppointmentAction;
  }

  // Confirm a pending appointment
  // Receives a pendingAppointment parameter of type Appointment
  // Subscribes to createNewPendingAppointment in the functions/src/index.ts file and passes the pendingAppointment parameter
  // The createNewPendingAppointment callable confirms the appointment...
  // removing it from the pending appointments collection and adding it to the appointments collection
  // If there is a response, the user is show a sucess message, the pending and confirmed appointments are refetched and...
  // the form is reset and closed
  // If there is no response or the response is false (set up in the functions/src/index.ts file), the user is shown an error message
  confirmAppointment(pendingAppointment: Appointment): Subscription {
    const callable = this.fireFunctions.httpsCallable('confirmAppointment');
    const confirmAppointmentAction = callable(pendingAppointment).pipe(takeUntil(this.onDestroy)).subscribe(data => {
      if (data) {
        this.toast.success('Appointment Confirmed');
        this.fetchPendingAppointments();
        this.fetchAppointments();
      } else {
        this.toast.error('Failed to confirm the appointment, please try again later.');
      }
    });
    return confirmAppointmentAction;
  }

  // Decline a pending appointment (when the user is the guest)
  // Receives a pendingAppointment parameter of type Appointment
  // Subscribes to declinePendingAppointment in the functions/rsc/index.ts file and passes the pendingAppointment parameter
  // The declinePendingAppointment callable declines the appointment...
  // removing it from the pending appointments collection and adding it to the declined appointments collection
  // If there is a response the user is shown a success message and both pending and declined appointments are refetched
  // If there is no response or the response is false(set up in the functions/src/index.ts file) the user is show an error message
  declinePendingAppointment(pendingAppointment: Appointment): Subscription {
    const callable = this.fireFunctions.httpsCallable('declinePendingAppointment');
    const declineAppointmentAction = callable(pendingAppointment).pipe(takeUntil(this.onDestroy)).subscribe(data => {
      if (data) {
        this.toast.success('Appointment Declined');
        this.fetchPendingAppointments();
        this.fetchDeclinedAppointments();
      } else {
        this.toast.error('Failed to decline appointment, please try again later.');
      }
    });
    return declineAppointmentAction;
  }

  // Cancel a pending appointment (when the user is the host)
  // Receives a pendingAppointment parameter of type Appointment
  // Subscribes to cancelPendingAppointment in the functions/rsc/index.ts file and passes the pendingAppointment parameter
  // The cancelPendingAppointment callable cancels the appointment, removing it from the pending appointments collection
  // If there is a response the user is shown a success message and pending appointments are refetched
  // If there is no response or the response is false(set up in the functions/src/index.ts file) the user is show an error message
  cancelPendingAppointment(pendingAppointment: Appointment): Subscription {
    const callable = this.fireFunctions.httpsCallable('cancelPendingAppointment');
    const cancelPendingAppointmentAction = callable(pendingAppointment).pipe(takeUntil(this.onDestroy)).subscribe(data => {
      if (data) {
        this.toast.success('Appointment Canceled');
        this.fetchPendingAppointments();
      } else {
        this.toast.error('Failed to cancel the appointment, please try again later.');
      }
    });
    return cancelPendingAppointmentAction;
  }

  // Request a confirmed appointment be cancelled
  // Receives an appointment parameter of type Appointment
  // Subscribes to requestCancellation in the functions/rsc/index.ts file and passes the appointment parameter
  // The requestCancellation callable removes the appointment from the from the confirmed appointments collection...
  // and adds it to the appointmentsPendingCancellation collection
  // If there is a response the user is shown a success message and...
  // both appointments pending cancellation and confirmed appointments are refetched
  // If there is no response or the response is false(set up in the functions/src/index.ts file) the user is show an error message
  requestCancellation(appointment: Appointment): Subscription {
    appointment.cancelRequestBy = this.activeUser.username;
    const callable = this.fireFunctions.httpsCallable('requestCancellation');
    const requestCancellationAction = callable(appointment).pipe(takeUntil(this.onDestroy)).subscribe(data => {
      if (data) {
        this.toast.success('Appointment Cancellation Requested');
        this.fetchAppointmentsPendingCancellation();
        this.fetchAppointments();
      } else {
        this.toast.error('Failed to request cancellation, please try again later.');
      }
    });
    return requestCancellationAction;
  }

  // Confirm/accept an appointment cancellation request
  // Receives an appointment parameter of type Appointment
  // Subscribes to confirmCancellation in the functions/rsc/index.ts file and passes the appointment parameter
  // The confirmCancellation callable removes the appointment from the from the appointmentsPendingCancellation collection
  // If there is a response the user is shown a success message and...
  // both appointments pending cancellation and confirmed appointments are refetched
  // If there is no response or the response is false(set up in the functions/src/index.ts file) the user is show an error message
  confirmCancellation(appointment: Appointment): Subscription {
    const callable = this.fireFunctions.httpsCallable('confirmCancellation');
    const confirmCancellationAction = callable(appointment).pipe(takeUntil(this.onDestroy)).subscribe(data => {
      if (data) {
        this.toast.success('Appointment Cancellation Accepted');
        this.fetchAppointmentsPendingCancellation();
        this.fetchAppointments();
      } else {
        this.toast.error('Failed to accept cancellation, please try again later.');
      }
    });
    return confirmCancellationAction;
  }

  // Decline an appointment cancellation request
  // Receives an appointment parameter of type Appointment
  // Subscribes to declineCancellation in the functions/src/index.ts file and passes the appointment parameter
  // The declineCancellation callable removes the appointment from the from the appointmentsPendingCancellation collection and...
  // adds the appointment back to the appointments collection
  // If there is a response the user is shown a success message and...
  // both appointments pending cancellation and confirmed appointments are refetched
  // If there is no response or the response is false(set up in the functions/src/index.ts file) the user is show an error message
  declineCancellation(appointment: Appointment): Subscription {
    const callable = this.fireFunctions.httpsCallable('declineCancellation');
    const declineCancellationAction = callable(appointment).pipe(takeUntil(this.onDestroy)).subscribe(data => {
      if (data) {
        if (this.activeUser.username === appointment.cancelRequestBy) {
          this.toast.success('Appointment Cancellation Cancelled');
        } else {
          this.toast.success('Appointment Cancellation Declined');
        }
        this.fetchAppointmentsPendingCancellation();
        this.fetchAppointments();
      } else {
        this.toast.error('Failed to decline cancellation, please try again later.');
      }
    });
    return declineCancellationAction;
  }

  // Delete declined appointment
  // Received a declined appointment parameter of type Appointment
  // Subscribes to deleteDeclinedAppointment in the functions/src/index.ts file and passes the declinedAppointment parameter
  // The deleteDeclinedAppointment callable permanently deletes the declined appointment from the declinedAppointments collection
  // If there is a response the user is shown a success message, if not, the user is shown an error message
  deleteDeclinedAppointment(declinedAppointment: Appointment): Subscription {
    const callable = this.fireFunctions.httpsCallable('deleteDeclinedAppointment');
    const deleteDeclinedAppointmentAction = callable(declinedAppointment).pipe(takeUntil(this.onDestroy)).subscribe(data => {
      if (data) {
        this.toast.success('Declined Appointment Permanently Deleted');
        this.fetchDeclinedAppointments();
      } else {
        this.toast.error('Failed to delete the declined appointment, please try again later.');
      }
    });
    return deleteDeclinedAppointmentAction;
  }

  // Open the new appointment modal
  openModal(template): void {
    this.modalRef = this.modalService.show(template, this.modalConfig);
  }
}
