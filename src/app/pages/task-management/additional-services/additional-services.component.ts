import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { AdditionalServicesService } from 'src/app/services/task-management/additional-services.service';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-additional-services',
  standalone: false,
  templateUrl: './additional-services.component.html',
  styleUrl: './additional-services.component.scss'
})
export class AdditionalServicesComponent implements OnInit{
  additionalServicesForm: FormGroup;


  displayedColumns: string[] = ['additionalServicesName', 'additionalServicePrice', 'status', 'action']; //'subTasks',
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  saveButtonLabel = 'Save';
  mode = 'add';
  isButtonDisable = false;
  selectedData!: { id: number };

    constructor(
        private fb: FormBuilder,
        private additionalServicesService: AdditionalServicesService,
        private messageService: MessageServiceService,
        private _dialog: MatDialog,
      ) {
        this.additionalServicesForm = this.fb.group({
          additionalServicesName: new FormControl(''),
          additionalServicePrice: new FormControl(''),
          status: new FormControl(''),
        });
      }

  ngOnInit(): void {
    this.populateData();
  }

  public populateData(): void {
    this.additionalServicesService.getData().subscribe((response: any) => {
      // console.log('get data response' , response);
      this.dataSource = new MatTableDataSource(response);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onSubmit() {
    try {
      let formData = this.additionalServicesForm.getRawValue();
      if (this.mode === 'add') {
        this.additionalServicesService.serviceCall(formData).subscribe(
          (response) => {
            if (
              this.dataSource &&
              this.dataSource.data &&
              this.dataSource.data.length > 0
            ) {
              this.dataSource = new MatTableDataSource([
                response,
                ...this.dataSource.data,
              ]);
            }
            console.log('Calling service addData with ID:', formData);
            this.dataSource = new MatTableDataSource([response]);
            this.messageService.showSuccess('Data Saved Successfully !');
          },
          (error) => {
            this.messageService.showError('Action Failed with Error :' + error);
          }
        );
      } else if (this.mode === 'edit') {
         console.log('Calling service editData with ID:', this.selectedData.id);
        this.additionalServicesService
          .editData(this.selectedData.id, formData)
          .subscribe({
            next: (response: any) => {
              // console.log('Selected Data:', this.selectedData);
              let elementIndex = this.dataSource.data.findIndex(
                (element) => element.id === this.selectedData?.id
              );
              this.dataSource.data[elementIndex] = response;
              this.dataSource = new MatTableDataSource(this.dataSource.data);
              this.messageService.showSuccess('Data Edited Successfully !');
            },
            error: (error) => {
              this.messageService.showError(
                'Action Failed with Error :' + error
              );
            },
          });
      }
    } catch (error) {
      this.messageService.showError('Action Failed with Error:' + error);
    }
    this.isButtonDisable = true;
    this.additionalServicesForm.disable();
  }

  public refreshData(): void {
    this.populateData();
  }

  public resetData() {
    this.additionalServicesForm.reset();
    this.saveButtonLabel = 'Save';
    this.isButtonDisable = false;
    this.additionalServicesForm.enable();
    this.mode = 'add';
  }

  public editData(data: any): void {
    this.additionalServicesForm.patchValue(data);
    this.saveButtonLabel = 'Edit';
    this.mode = 'edit';
    console.log('Mode ' + this.mode);
    this.selectedData = data;
  }

  public confirmDelete(data: any): void {
       const dialogRef = this._dialog.open(ConfirmDialogComponent, {
            data: 'Are you sure you want to delete this record?',
          });
      
          dialogRef.afterClosed().subscribe((result: any) => {
            if (result) {
              this.deleteData(data);
            }
          }); 
    }
  
    public deleteData(data: any) {
      const id = data.id;
      try {
        this.additionalServicesService.deleteData(id).subscribe({
          next: (response: any) => {
            const index = this.dataSource.data.findIndex(
              (element) => element.id === id
            );
            if (index !== -1) {
              this.dataSource.data.splice(index, 1);
            }
            this.dataSource = new MatTableDataSource(this.dataSource.data);
            this.messageService.showSuccess('Data Deleted Successfully !');
          },
          error: (error) => {
            this.messageService.showError('Action Failed with Error :' + error);
          },
        });
      } catch (error) {
        this.messageService.showError('Action Failed with Error:' + error);
      }
    }

}
