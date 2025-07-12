export interface Appointment {
  id?: number;
  appointmentDate: string;   
  timeSlot: string;          
  bay?: number;
  status?: string;
  price?: number;
  taskName?: string;
  taskId?: number
}

export interface TimeSlot {
  time: string;         // e.g., "09:00:00"
  bookedCount: number;  // e.g., 0–3
}

export interface Task {
  name: string;
  completed: boolean;
  subtasks?: Task[];
}