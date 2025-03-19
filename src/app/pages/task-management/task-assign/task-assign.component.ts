import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { TaskAssignService } from 'src/app/services/task-management/task-assign.service';

interface Task {
  subtasks: any;
  value: string;
  viewValue: string;
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
  selectData!: { taskId: number };
  isButtonDisable = false;

  selectedSubtasks: string[] = [];

  constructor(
    private fb: FormBuilder,
    private taskAssignService: TaskAssignService,
    private messageService: MessageServiceService
  ) {
    this.taskAssignForm = this.fb.group({
      taskName: new FormControl(''),
      taskCreatedBy: new FormControl({ value: '', disabled: true }), //
      customerName: new FormControl(''),
      status: new FormControl({ value: 'Start', disabled: true }), //
      subTasks: this.fb.array([]),
    });
  }

  tasks: Task[] = [
    {
      value: 'Normal_Car_Wash',
      viewValue: 'Normal Car Wash',
      subtasks: [
        'Assign Washing Bay',
        'Wash the Vehicle',
        'Complete the Washing Process',
      ],
    },
    {
      value: 'Pick-up_and_Drop-off_Car_wash',
      viewValue: 'Pick-up/Drop-off Car wash',
      subtasks: [
        'Pick-up Vehicle to the Service Center',
        'Assign Washing Bay',
        'Wash the Vehicle',
        'Complete the Washing Process',
        'Drop-off the vehicle',
      ],
    },
    {
      value: 'Remote_Car_Wash',
      viewValue: 'Remote Car Wash',
      subtasks: [
        'Assign Washing Bay',
        'Wash the Vehicle',
        'Complete the Washing Process',
      ],
    },
    {
      value: 'Remote_Maintain_Service',
      viewValue: 'Remote Maintain Service',
      subtasks: [
        'Assign Washing Bay',
        'Wash the Vehicle',
        'Complete the Washing Process',
      ],
    },
  ];

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
          .editData(this.selectData.taskId, formData)
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

    this.taskAssignForm
      .get('taskName')
      ?.valueChanges.subscribe((selectedTask) => {
        this.updateSubtasks(selectedTask);
      });
  }
  updateSubtasks(selectedTask: string) {
    const task = this.tasks.find((t) => t.value === selectedTask);
    this.selectedSubtasks = task ? task.subtasks : [];
  }

  public populateData(): void {
    this.taskAssignService.getData().subscribe((response: any) => {
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

  public editData(data: any) {
    this.taskAssignForm.patchValue(data);
    this.mode = 'edit';
    this.selectData = data;
    this.saveButtonLabel = 'Edit';
  }

  public deleteData(data: any) {
    const taskId = data.taskId;
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
    this.taskAssignForm.reset();
    this.saveButtonLabel = 'Save';
    this.taskAssignForm.enable();
    this.taskAssignForm.get('status')?.disable();
    this.taskAssignForm.get('taskCreatedBy')?.disable();
    this.isButtonDisable = false;
    this.populateData();
  }

  public refreshData(): void {
    this.populateData();
  }
}
