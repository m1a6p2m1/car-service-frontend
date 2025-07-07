import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { TaskIntroduceService } from 'src/app/services/task-management/task-introduce.service';

@Component({
  selector: 'app-task-introduce',
  standalone: false,
  templateUrl: './task-introduce.component.html',
  styleUrl: './task-introduce.component.scss',
})
export class TaskIntroduceComponent implements OnInit {
  taskIntroduceForm: FormGroup;

  displayedColumns: string[] = ['taskName', 'action']; //'subTasks',
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  saveButtonLabel = 'Save';
  mode = 'add';
  selectedSubtasks: any;
  isButtonDisable = false;
  selectedData!: { id: number };

  constructor(
    private fb: FormBuilder,
    private taskIntroduceService: TaskIntroduceService,
    private messageService: MessageServiceService
  ) {
    this.taskIntroduceForm = this.fb.group({
      taskName: new FormControl(''),
      subTasks: this.fb.array([]),
      totalTaskPrice: new FormControl({ value: '', disabled: true }),
      description: new FormControl(''),
      shortDescription: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.populateData();
  }

  public populateData(): void {
    this.taskIntroduceService.getData().subscribe((response: any) => {
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
      let formData = this.taskIntroduceForm.getRawValue();
      if (this.mode === 'add') {
        this.taskIntroduceService.serviceCall(formData).subscribe(
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
        // console.log('Calling service editData with ID:', this.selectedData.id);
        this.taskIntroduceService
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
    this.taskIntroduceForm.disable();
  }

  get subTasks() {
    return this.taskIntroduceForm.get('subTasks') as FormArray;
  }

  addSubTask() {
    this.subTasks.push(
      this.fb.group({ id: [null], subTaskName: [''], subTaskPrice: [''] })
    );
  }

  removeSubTask(index: number) {
    this.subTasks.removeAt(index);
  }

  public refreshData(): void {
    this.populateData();
  }

  public resetData() {
    const subTasksFormArray = this.subTasks;
    subTasksFormArray.clear();
    this.taskIntroduceForm.reset();
    this.saveButtonLabel = 'Save';
    this.isButtonDisable = false;
    this.taskIntroduceForm.enable();
    this.taskIntroduceForm.get('totalTaskPrice')?.disable();
    this.mode = 'add';
  }

  public editData(data: any): void {
    console.log('Edit clicked:', data);
    this.resetData();
    this.taskIntroduceForm.patchValue({
      taskName: data.taskName,
      description: data.description,
      shortDescription: data.shortDescription,
      totalTaskPrice: data.totalTaskPrice,
    });
    this.taskIntroduceForm.get('totalTaskPrice')?.disable();
    if (data.subTasks && data.subTasks.length > 0) {
      data.subTasks.forEach((subTask: any) => {
        this.subTasks.push(
          this.fb.group({
            subTaskName: [subTask.subTaskName],
            subTaskPrice: [subTask.subTaskPrice],
          })
        );
      });
    }
    // this.taskIntroduceForm.formControlName('totalTaskPrice').disabled();
    this.saveButtonLabel = 'Edit';
    this.mode = 'edit';
    // this.selectedData = data;
    this.selectedData = { id: data.id };
  }

  public deleteData(data: any) {
    const id = data.id;
    try {
      this.taskIntroduceService.deleteData(id).subscribe({
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
