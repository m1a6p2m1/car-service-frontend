import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HttpService } from 'src/app/services/http.service';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { TaskAssignService } from 'src/app/services/task-management/task-assign.service';

interface Task {
  id: any;
  taskName: string;
  definedSubTaskDtos: any;
}
interface Customer {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-task-assign',
  standalone: false,
  templateUrl: './task-assign.component.html',
  styleUrl: './task-assign.component.scss',
})
export class TaskAssignComponent implements OnInit {
  taskAssignForm: FormGroup;

  displayedColumns: string[] = ['taskName', 'status', 'customerName', 'action'];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  mode = 'add';
  saveButtonLabel = 'Save';
  selectData: any;
  isButtonDisable = false;

  selectedSubtasks: any[] = [];

  constructor(
    private fb: FormBuilder,
    private taskAssignService: TaskAssignService,
    private messageService: MessageServiceService,
    private httpService: HttpService
  ) {
    this.taskAssignForm = this.fb.group({
      taskName: new FormControl(''),
      taskCreatedBy: new FormControl({ value: '', disabled: true }), //
      customerName: new FormControl(''),
      status: new FormControl({ value: 'Start', disabled: true }), //
      subTasks: this.fb.array([]),
    });
  }

  tasks: Task[] = [];

  customers: Customer[] = [
    { value: 'Ruwan', viewValue: 'Ruwan' },
    { value: 'Kamal', viewValue: 'Kamal' },
    { value: 'Amal', viewValue: 'Amal' },
    { value: 'Doty', viewValue: 'Doty' },
  ];

  onSubmit() {
    try {
      let formData = this.taskAssignForm.getRawValue();
      formData.status = 'Start';
      if (this.mode === 'add') {
        this.taskAssignService.serviceCall(formData).subscribe(
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
            this.dataSource = new MatTableDataSource([response]);
            this.messageService.showSuccess('Data Saved Successfully !');
          },
          (error) => {
            this.messageService.showError('Action Failed with Error :' + error);
          }
        );
      } else if (this.mode === 'edit') {
        this.taskAssignService
          .editData(this.selectData.id, formData)
          .subscribe({
            next: (response: any) => {
              let elementIndex = this.dataSource.data.findIndex(
                (element) => element.taskId === this.selectData?.taskId
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
    this.taskAssignForm.disable();
  }

  ngOnInit(): void {
    this.populateData();
    this.getDefinedTasks();
    this.setCreatedByValue();

    this.taskAssignForm
      .get('taskName')
      ?.valueChanges.subscribe((selectedTask) => {
        this.updateSubtasks(selectedTask);
      });
  }

  public setCreatedByValue(): void {
    this.taskAssignForm.patchValue({
      taskCreatedBy: this.httpService.getLoginNameFromCache(),
    });
  }

  updateSubtasks(selectedTask: string) {
    if (this.mode === 'add') {
      const task = this.tasks.find((t) => t.taskName === selectedTask);
      // this.selectedSubtasks = task ? task.taskName : [];
      if (task) this.selectedSubtasks = task.definedSubTaskDtos;

      const subTasksFormArray = this.subTasks;

      while (subTasksFormArray.length !== 0) {
        subTasksFormArray.removeAt(0);
      }

      this.selectedSubtasks.forEach((item) => {
        subTasksFormArray.push(this.createSubTasksFormGroup(item));
      });
    }
  }

  public createSubTasksFormGroup(item: any): FormGroup {
    return this.fb.group({
      description: { disabled: true, value: item.subTaskName },
    });
  }

  get subTasks() {
    return this.taskAssignForm.get('subTasks') as FormArray;
  }

  addSubTask() {
    this.subTasks.push(
      this.fb.group({
        id: [null],
        description: [''],
      })
    );
  }

  removeSubTask(index: number) {
    this.subTasks.removeAt(index);
  }

  public populateData(): void {
    this.taskAssignService.getData().subscribe((response: any) => {
      this.dataSource = new MatTableDataSource(response);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  public getDefinedTasks(): void {
    this.taskAssignService.getDefinedTasks().subscribe((response: any) => {
      if (response) {
        this.tasks = response;
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public editData(data: any) {
    this.resetData();
    this.mode = 'edit';
    this.taskAssignForm.patchValue(data);

    data.subTasks.forEach((subTask: any) => {
      this.subTasks.push(
        this.fb.group({
          id: [subTask.id],
          description: [subTask.description],
        })
      );
    });

    this.selectData = data;
    this.saveButtonLabel = 'Edit';
  }

  public deleteData(data: any) {
    const taskId = data.id;
    try {
      this.taskAssignService.deleteData(taskId).subscribe({
        next: (response: any) => {
          const index = this.dataSource.data.findIndex(
            (element) => element.taskId === taskId
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

  public resetData() {
    const subTasksFormArray = this.subTasks;
    subTasksFormArray.clear();
    this.resetFormManually();
    this.saveButtonLabel = 'Save';
    this.isButtonDisable = false;
    this.enableFormManually();
  }

  public refreshData(): void {
    this.populateData();
  }

  public resetFormManually() {
    this.taskAssignForm.get('taskName')?.reset({}, { emitEvent: false });
    this.taskAssignForm.get('customerName')?.reset();
  }

  public enableFormManually() {
    this.taskAssignForm.get('taskName')?.enable();
    this.taskAssignForm.get('customerName')?.enable();
  }
}
