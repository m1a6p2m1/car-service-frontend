export interface Appointment {
  id?: number;
  appointmentDate: string;   
  timeSlot: string;          
  bay?: number;
  status?: string;
}

export interface TimeSlot {
  time: string;              
  bookedCount: number;       
}