export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dob: Date;
  status: "Active" | "Inactive" | "Pending";
  registeredDate: Date;
}
