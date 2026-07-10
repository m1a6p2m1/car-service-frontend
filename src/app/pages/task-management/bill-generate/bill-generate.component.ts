import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { TaskAssignService } from 'src/app/services/task-management/task-assign.service';
import { BillGenerateDetailsComponent } from '../bill-generate-details/bill-generate-details.component';

@Component({
  selector: 'app-bill-generate',
  standalone: false,
  templateUrl: './bill-generate.component.html',
  styleUrl: './bill-generate.component.scss'
})
export class BillGenerateComponent implements OnInit {

  displayedColumns: string[] = ['appointmentUniqueNo', 'date', 'customerName', 'licencePlate', 'action'];
        dataSource!: MatTableDataSource<any>;
      
        @ViewChild(MatPaginator) paginator!: MatPaginator;
        @ViewChild(MatSort) sort!: MatSort;
  
    constructor(
      private taskAssignService: TaskAssignService,
      private messageService: MessageServiceService,
      private _dialog: MatDialog,
      private router: Router,
    ){}

  ngOnInit(): void{
    this.populateData();
  }

  formatDateFromArray(dateArray: number[]): string {
    if(!dateArray) return '';
    const [year, month, day] = dateArray;
    return  `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }

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

  populateData(){
    this.taskAssignService.getAllDoneStatus().subscribe((response: any) => {
      this.dataSource = new MatTableDataSource(response);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  billGenerate(row: any){
     try {
          const dialogRef = this._dialog.open(BillGenerateDetailsComponent, {
        
          width:'700px',
          height:'auto',
          data: row
        });
        dialogRef.afterClosed().subscribe(result => {

      if(result){

        console.log("Generated Bill Data", result);

      }

    });
            
    } catch (error) {
      console.log(error);
      this.messageService.showError('Action Failed!');
    }     
  }
}
