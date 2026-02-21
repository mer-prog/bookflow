import type { Booking, Service, Staff, Business, User } from "@/generated/prisma/client";

export type BookingWithRelations = Booking & {
  service: Service;
  staff: Staff;
  customer?: User | null;
};

export type ServiceWithStaff = Service & {
  staffServices: { staff: Staff }[];
};

export type StaffWithServices = Staff & {
  staffServices: { service: Service }[];
};

export type BusinessWithRelations = Business & {
  services: Service[];
  staff: Staff[];
};

export interface BusinessHours {
  [key: string]: {
    open: string;
    close: string;
    closed?: boolean;
  };
}

export interface TimeSlotOption {
  time: string;
  available: boolean;
}

export interface BookingFormData {
  serviceId: string;
  staffId: string;
  date: string;
  time: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes: string;
}

export interface DashboardStats {
  todayBookings: number;
  weekBookings: number;
  totalRevenue: number;
  cancelRate: number;
}
