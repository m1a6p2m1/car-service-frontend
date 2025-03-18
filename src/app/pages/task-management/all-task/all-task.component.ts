import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AllTaskService } from 'src/app/services/task-management/all-task.service';

@Component({
  selector: 'app-all-task',
  standalone: false,
  templateUrl: './all-task.component.html',
  styleUrl: './all-task.component.scss'
})
export class AllTaskComponent implements OnInit{
  allTaskForm: FormGroup;
  displayedColumns: string[] = ['taskName','assignedCustomer', 'progress', 'viewTaskStatus', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  saveButtonLabel = 'Save';
  mode = 'add';
  selectedData!: { allTaskId: number; };
  isButtonDisable = false;

  constructor(
    private fb: FormBuilder,
    private allTaskService: AllTaskService
  ){
    this.allTaskForm = this.fb.group({
      inProgressTasks: new FormControl(''),
      taskName: new FormControl(''),
      taskCreatedBy: new FormControl(''),
      assignedCustomer: new FormControl(''),
      progress: new FormControl(''),
      priority: new FormControl(''),
      viewTaskStatus: new FormControl(''),
      subTasks: new FormControl('')
    });
  }

  ngOnInit(): void{
    this.populateData();
  }

  onSubmit(){
    if (this.mode==='add') {
      this.allTaskService.serviceCall(this.allTaskForm.value).subscribe((response)=>{
        console.log(' server response:', response);
      });
    }else if (this.mode==='edit') {
      this.allTaskService.editData(this.selectedData.allTaskId,this.allTaskForm.value).subscribe((response:any)=>{
        console.log(' server response:', response);
      })
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public populateData(): void{
    this.allTaskService.getData().subscribe((response: any)=>{
      this.dataSource = new MatTableDataSource(response);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  public resetData(): void{
    this.allTaskForm.reset();
    this.saveButtonLabel = 'Save';
    this.isButtonDisable = false;
    this.allTaskForm.enable();
    this.allTaskForm.setErrors = null!;
    this.allTaskForm.updateValueAndValidity();
  }

  public editData(data: any):void{
    this.allTaskForm.patchValue(data);
    this.saveButtonLabel = 'Edit';
    this.mode = 'edit';
    this.selectedData = data;
  }

  public deleteData(data: any):void{}

  public refreshData(): void{
    this.populateData();
  }
}
