import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AppointmentService } from 'src/app/services/appointment.service';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmStatusComponent } from '../../registration/confirm-status/confirm-status.component';

export interface Appointment {
  id: number;
  customerName: string;
  date: string;
  time: string;
  billCreated: boolean;
}

@Component({
  selector: 'app-all-appointments',
  standalone:false,
  templateUrl: './all-appointments.component.html',
  styleUrl: './all-appointments.component.scss'
})
export class AllAppointmentsComponent implements OnInit{

  displayedColumns: string[] = ['customerName', 'appointmentDate', 'appointmentTime','serviceType', 'licencePlate', 'contactNumber', 'action'];
      dataSource!: MatTableDataSource<any>;
    
      @ViewChild(MatPaginator) paginator!: MatPaginator;
      @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private appointmentService: AppointmentService,
    private messageService: MessageServiceService,
    private _dialog: MatDialog,
    private router: Router,
  ){}

  ngOnInit(): void{
    // console.log('oninit')
    this.populateData();
  }

  //table data filtering
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public refreshData(): void{
      this.populateData();
    }
  
  populateData(): void {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
    //     console.log('Logged user:', user);
    // console.log('Role:', user?.role);
    // console.log('CusNo:', user?.uniqueCusNo);

    //  Validate user data first
    if (!user || !user.role) {
      console.error('User not found in localStorage or role missing');
      this.messageService.showError('User session expired. Please login again.');
      return;
    }
        if (user.role === 'CUSTOMER') {
      //     if (!user.uniqueCusNo) {
      //   console.error('uniqueCusNo is missing');
      //   this.messageService.showError('Customer number not found.');
      //   return;
      // }
          // Only customer appointments
          this.appointmentService.getAppointmentsByCustomer(user.uniqueCusNo).subscribe(
            (res: any) => {
            console.log('Customer appointments: ', res);  

              this.dataSource = new MatTableDataSource(res);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
            },
            (error) => {
              console.error('Full API Error:', error);

              this.messageService.showError(
              error?.error?.message || error?.message || 'Unknown error occurred'
              );
            }
          );

        } else {
          // Admin / Manager → all appointments
          this.appointmentService.getAppointments().subscribe(
            (response: any) => {
              console.log('All appointments: ', response);

              this.dataSource = new MatTableDataSource(response);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
            },
            (error) => {
              this.messageService.showError('Error: ' + error);
            }
          );
        }

      } catch (error) {
        this.messageService.showError('Action Failed: ' + error);
      }
  }

  pad(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }

  formatTime(time: any): string {
    if (!time) return '';

    if (typeof time === 'string') {
      return time.substring(0, 5);
    }

    if (Array.isArray(time)) {
      return `${this.pad(time[0])}:${this.pad(time[1])}`;
    }

    return '';
  }

  public editData(data: any): void {
    this.router.navigate(['/dashboard/appointment-service'],{
      state: {
        appointmentData: data,
        isEditMode: true
      }
    });
  }
  

  public confirmDelete(data: any): void {
      const dialogRef = this._dialog.open(ConfirmDialogComponent, {
        data: 'Are you sure you want to Delete this Appointment record?',
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.deleteAppointment(data.id);
        }
      });
    }
  
   deleteAppointment(id: number): void {
  this.appointmentService.deleteAppointment(id).subscribe({
    next: (response: any) => {
      // alert('Appointment deleted successfully');
      this.dataSource = new MatTableDataSource(this.dataSource.data);
      this.messageService.showSuccess('Appointment Deleted Successfully !');
      this.refreshData(); // reload table
    },
    error: (error) => {
      console.error(error);
      // alert('Error deleting appointment');
      this.messageService.showError('Action Failed with Error :' + error);
    }
  });
}

//disable edit and delete button date before today
isActionAllowed(appointmentDate: string |Date): boolean {

  // console.log('appointmentDate:', appointmentDate);
  // console.log('converted:', new Date(appointmentDate));

  const today = new Date();
  today.setHours(0,0,0,0);

  const appDate = new Date(appointmentDate);
  appDate.setHours(0,0,0,0);

  return appDate.getTime() >= today.getTime(); //allows today + future 
}

//display bill
viewBill(id: number) {

  this.appointmentService.viewBill(id)
    .subscribe((response: Blob) => {

      const fileURL = URL.createObjectURL(response);

      const pdfWindow = window.open(fileURL, '_blank');

      if (pdfWindow) {
        pdfWindow.onload = () => {
          URL.revokeObjectURL(fileURL);
        };
      }

    });

}

public confirmMakePayment(data: any): void {
    const dialogRef = this._dialog.open(ConfirmStatusComponent, {
      data: 'Do You Want to Confirm the Payment?',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.MakePayment(data);
      }
    });
  }

MakePayment(appointment: any): void{
  this.appointmentService.updatePaymentStatus(appointment.id).subscribe({
    next: (response: any) => {
      this.messageService.showSuccess("Payment Completed Successfully");
    },
    error: (error: any) => {
      console.log(error);
      this.messageService.showError("Payment Update Failed...!");
    }
  });
}


}
