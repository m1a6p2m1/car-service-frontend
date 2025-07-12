import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CustomerFeedbackService } from 'src/app/services/feedback/customer-feedback.service';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { FeedbackDetailsComponent } from '../feedback-details/feedback-details.component';

@Component({
  selector: 'app-all-feedbacks',
  standalone: false,
  templateUrl: './all-feedbacks.component.html',
  styleUrl: './all-feedbacks.component.scss'
})
export class AllFeedbacksComponent implements OnInit {

  selectedData!: { id: number; };

  displayedColumns: string[] = ['userName','taskNumber', 'serviceDate', 'serviceQuality', 'recommendation', 'complaint','action'];
  
    dataSource!: MatTableDataSource<any>;
    
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
  selectedFeedback: any;

  constructor(
      private customerFeedbackService: CustomerFeedbackService,
      private messageService:MessageServiceService,
      private _dialog: MatDialog,
    ){ }

  ngOnInit(): void {
    this.populateData();
  }

  public populateData():void{
    try {
      this.customerFeedbackService.getAllData().subscribe((response: any)=>{
        this.dataSource = new MatTableDataSource(response);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log('server response: ',response);
      },
      (error)=>{
        this.messageService.showError('Action Failed with Error :'+ error);
      }
    );
    } catch (error) {
      this.messageService.showError('Action Failed with Error :'+ error); 
    }
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

  public viewData(feedback: any): void{
      this.selectedFeedback = feedback;
      const dialogRef = this._dialog.open(FeedbackDetailsComponent, {
      data: this.selectedFeedback 
      });
    }

}
