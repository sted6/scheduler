/*
TODO
  Improve error handling & Implement race condition protection

INDEX
  Fetch all confirmed appointments by user............line 34
  Fetch all pending appointments by user..............line 57
  Fetch user's appointments pending cancellation......line 80
  Fetch user's declined appointments by guest.........line 103

  Create new pending appointment......................line 122
  Confirm a pending appointment.......................line 140
  Decline a pending appointment (guest)...............line 159
  Cancel a pending appointment (host).................line 175

  Request a cancellation of a confirmed appointment...line 190
  Confirm a cancellation request......................line 205
  Decline a cancellation request......................line 220
  Delete a declined request...........................line 235
*/

import { Timestamp } from '@google-cloud/firestore';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

const firestoreDB = admin.firestore();

// Fetch confirmed appointments by user
// Fetches all documents in the appointments collection where user is host or guest
// Adds the document id and the document data to an array and returns that array to the front end
// If there is an error it returns false to the front end
export const fetchAppointments = functions.https.onCall(async (user) => {
  try {
    const appointments: FirebaseFirestore.DocumentData[] = [];
    await firestoreDB.collection('appointments').where('host', '==', user).get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        appointments.push([doc.id, doc.data()]);
      });
    });
    await firestoreDB.collection('appointments').where('guest', '==', user).get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        appointments.push([doc.id, doc.data()]);
      });
    });
    return appointments;
  } catch (e) {
    return false;
  }
});

// Fetch pending appointments by user
// Fetches all documents in the pendingAppointments collection where user is host or guest
// Adds each document id and the corresponding document data to an array and returns that array to the front end
// If there is an error it returns false to the front end
export const fetchPendingAppointments = functions.https.onCall(async (user) => {
  try {
    const pendingAppointments: FirebaseFirestore.DocumentData[] = [];
    await firestoreDB.collection('pendingAppointments').where('host', '==', user).get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        pendingAppointments.push([doc.id, doc.data()]);
      });
    });
    await firestoreDB.collection('pendingAppointments').where('guest', '==', user).get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        pendingAppointments.push([doc.id, doc.data()]);
      });
    });
    return pendingAppointments;
  } catch (e) {
    return false;
  }
});

// Fetch user's appointments pending cancellation
// Fetches all documents in the appointmentsPendingCancellation collection where user is host or guest
// Adds each document id and the corresponding document data to an array and returns that array to the front end
// If there is an error it returns false to the front end
export const fetchAppointmentsPendingCancellation = functions.https.onCall(async (user) => {
  try {
    const appointmentsPendingCancellation: FirebaseFirestore.DocumentData[] = [];
    await firestoreDB.collection('appointmentsPendingCancellation').where('host', '==', user).get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        appointmentsPendingCancellation.push([doc.id, doc.data()]);
      });
    });
    await firestoreDB.collection('appointmentsPendingCancellation').where('guest', '==', user).get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        appointmentsPendingCancellation.push([doc.id, doc.data()]);
      });
    });
    return appointmentsPendingCancellation;
  } catch (e) {
    return false;
  }
});

// Fetch user's appointments declined by guest
// Fetches all documents in the declinedAppointments collection where user is host
// Adds each document id and the corresponding document data to an array and returns that array to the front end
// If there is an error it returns false to the front end
export const fetchDeclinedAppointments = functions.https.onCall(async (user) => {
  try {
    const declinedAppointments: FirebaseFirestore.DocumentData[] = [];
    await firestoreDB.collection('declinedAppointments').where('host', '==', user).get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        declinedAppointments.push([doc.id, doc.data()]);
      });
    });
    return declinedAppointments;
  } catch (e) {
    return false;
  }
});

// Create a new pending appointment
// Receives an Appointment object from the front end
// Converts the appointment's start time and end time to google cloud timestamps
// Adds the appointment to the pendingAppointments collection and returns true
// If an error is caught, it returns false
export const createNewPendingAppointment = functions.https.onCall(async (appointment) => {
  appointment.startTime = new Timestamp(appointment.startTime, 0);
  appointment.endTime = new Timestamp(appointment.endTime, 0);
  try {
    firestoreDB.collection('pendingAppointments').add(appointment);
    return true;
  } catch (e) {
    return false;
  }
});

// Confirm a pending appointment
// Receives an Appointment object from the front end
// Stores the appointment id in a local constant
// Deletes the appointment id from the appointment object
// Adds the appointment to the appointments collection
// Removes appointment from the pendingAppointments collection using the appointment id stored in the local constant
// Returns true if both are successfull, returns false if an error is caught
export const confirmAppointment = functions.https.onCall(async (appointment) => {
  const docId = appointment.id;
  delete appointment.id;
  try {
    await firestoreDB.collection('appointments').add(appointment);
    await firestoreDB.collection('pendingAppointments').doc(docId).delete();
    return true;
  } catch (e) {
    return false;
  }
});

// Decline a pending appointment (when the user is the guest)
// Receives an Appointment object from the front end
// Stores the appointment id in a local constant
// Deletes the appointment id from the appointment object
// Adds the appointment to the declinedAppointments collection
// Removes appointment from the pendingAppointments collection using the appointment id stored in the local constant
// Returns true if both are successfull, returns false if an error is caught
export const declinePendingAppointment = functions.https.onCall(async (appointment) => {
  const docId = appointment.id;
  delete appointment.id;
  try {
    await firestoreDB.collection('declinedAppointments').add(appointment);
    await firestoreDB.collection('pendingAppointments').doc(docId).delete();
    return true;
  } catch (e) {
    return false;
  }
});

// Cancel a pending appointment (when the user is the host)
// Receives an Appointment object from the front end
// Removes appointment from the pendingAppointments collection using the appointment id
// Returns true if successfull, returns false if an error is caught
export const cancelPendingAppointment = functions.https.onCall(async (appointment) => {
  try {
    await firestoreDB.collection('pendingAppointments').doc(appointment.id).delete();
    return true;
  } catch (e) {
    return false;
  }
});

// Request a cancellation of a confirmed appointment
// Receives an Appointment object from the front end
// Removes appointment from the appointments collection using the appointment id
// Deletes the appointment id from the appointment object
// Adds the appointment to the appointmentsPendingCancellation collection
// Returns true if both are successfull, returns false if an error is caught
export const requestCancellation = functions.https.onCall(async (appointment) => {
  try {
    await firestoreDB.collection('appointments').doc(appointment.id).delete();
    delete appointment.id;
    await firestoreDB.collection('appointmentsPendingCancellation').add(appointment);
    return true;
  } catch (e) {
    return false;
  }
});

// Confirm a cancellation request
// Receives an Appointment object from the front end
// Removes appointment from the appointmentsPendingCancellation collection using the appointment id
// Returns true if successfull, returns false if an error is caught
export const confirmCancellation = functions.https.onCall(async (appointment) => {
  try {
    await firestoreDB.collection('appointmentsPendingCancellation').doc(appointment.id).delete();
    return true;
  } catch (e) {
    return false;
  }
});

// Decline a cancellation request
// Receives an Appointment object from the front end
// Removes appointment from the appointmentsPendingCancellation collection using the appointment id
// Deletes the appointment id from the appointment object
// Adds the appointment to the appointments collection
// Returns true if both are successfull, returns false if an error is caught
export const declineCancellation = functions.https.onCall(async (appointment) => {
  try {
    await firestoreDB.collection('appointmentsPendingCancellation').doc(appointment.id).delete();
    delete appointment.id;
    await firestoreDB.collection('appointments').add(appointment);
    return true;
  } catch (e) {
    return false;
  }
});

// Permanently delete a declined appointment
// Receives an Appointment object from the front end
// Remove the appointment from the declinedAppointments collection using the appointment id
// Returns true if the operation is successful and false if not
export const deleteDeclinedAppointment = functions.https.onCall(async (appointment) => {
  try {
    await firestoreDB.collection('declinedAppointments').doc(appointment.id).delete();
    return true;
  } catch (e) {
    return false;
  }
});
