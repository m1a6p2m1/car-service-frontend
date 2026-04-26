import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-appointment',
  standalone: false,
  templateUrl: './confirm-appointment.component.html',
  styleUrl: './confirm-appointment.component.scss'
})
export class ConfirmAppointmentComponent {
  constructor(
      public dialogRef: MatDialogRef<ConfirmAppointmentComponent>,
      @Inject(MAT_DIALOG_DATA) public message: string
    ){}
  
    onConfirm(): void {
      this.dialogRef.close(true);
    }
  
    onCancel(): void {
      this.dialogRef.close(false);
    }
}
