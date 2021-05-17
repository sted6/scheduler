export class Appointment {
  title: string;
  description: string;
  startTime: any;
  endTime: any;
  host: string;
  guest: string;
  id?: string;
  cancelRequestBy?: string;

  constructor(
    title: string,
    description: string,
    startTime: any,
    endTime: any,
    host: string,
    guest: string,
    id?: string,
    cancelRequestBy?: string
    ) {
      this.title = title;
      this.description = description;
      this.startTime = startTime;
      this.endTime = endTime;
      this.host = host;
      this.guest = guest;
      if (id) {
        this.id = id;
      }
      if (cancelRequestBy) {
        this.cancelRequestBy = cancelRequestBy;
      }
  }
}
