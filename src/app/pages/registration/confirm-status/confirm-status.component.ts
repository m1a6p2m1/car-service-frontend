import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-status',
  standalone: false,
  templateUrl: './confirm-status.component.html',
  styleUrl: './confirm-status.component.scss'
})
export class ConfirmStatusComponent {
  constructor(
        public dialogRef: MatDialogRef<ConfirmStatusComponent>,
        @Inject(MAT_DIALOG_DATA) public message: string
      ){}
    
      onConfirm(): void {
        this.dialogRef.close(true);
      }
    
      onCancel(): void {
        this.dialogRef.close(false);
      }
}
