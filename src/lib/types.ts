export interface Patient {
  id: number;
  name: string;
  email: string;
  phone: string;
  dob: Date;
  gender?: string;
  address?: string;
  medicalHistory?: string;
  status: "Active" | "Inactive" | "Pending";
  registeredDate: Date;
}

export interface RawPatient {
  id: number;
  name: string;
  email: string;
  phone: string;
  dob: string | Date;
  gender: string | null;
  address: string | null;
  medical_history: string | null;
  status: string;
  registered_date: string | Date;
}
