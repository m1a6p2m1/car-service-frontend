import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-review-confirm-dialog',
  standalone: false,
  templateUrl: './review-confirm-dialog.component.html',
  styleUrl: './review-confirm-dialog.component.scss'
})
export class ReviewConfirmDialogComponent {
  constructor(
      public dialogRef: MatDialogRef<ReviewConfirmDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public message: string
    ){}
  
    onConfirm(): void {
      this.dialogRef.close(true);
    }
  
    onCancel(): void {
      this.dialogRef.close(false);
    }
}
