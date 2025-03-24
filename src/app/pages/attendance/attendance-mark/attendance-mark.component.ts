import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AttendanceMarkService } from 'src/app/services/attendance/attendance-mark.service';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';

interface Status {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-attendance-mark',
  standalone: false,
  templateUrl: './attendance-mark.component.html',
  styleUrl: './attendance-mark.component.scss',
})
export class AttendanceMarkComponent implements OnInit {
  attendanceMarkForm: FormGroup;
  displayedColumns: string[] = ['empId', 'employeeName', 'status'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  submitted = false;
  selectedImageUrl!: SafeUrl | null;
  isFileSelected = false;
  fileButtonDisable = false;
  isButtonDisable = false;

  constructor(
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private attendanceMarkService: AttendanceMarkService,
    private messageService: MessageServiceService
  ) {
    this.attendanceMarkForm = this.fb.group({
      empId: new FormControl({ value: '', disabled: true }), //
      employeeName: new FormControl({ value: '', disabled: true }),
      image: new FormControl('', [Validators.required]),
      imageName: new FormControl(''),
      imageType: new FormControl(''),
      status: new FormControl('', [Validators.required]),
    });
  }

  statuses: Status[] = [
    { value: 'Present', viewValue: 'Present' },
    { value: 'Absent', viewValue: 'Absent' },
    { value: 'Onleave', viewValue: 'Onleave' },
  ];

  get formControl() {
    return this.attendanceMarkForm?.controls;
  }

  ngOnInit(): void {
    this.populateData();
  }

  public populateData(): void {
    this.attendanceMarkService.getData().subscribe((response: any) => {
      this.dataSource = new MatTableDataSource(response);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log('get data response:', response);
    });
  }

  public prepareAttendanceMarkData(): FormData {
    const attendanceMarkFormData = new FormData();
    // demoFormData.append('demoForm', this.demoForm.value);
    attendanceMarkFormData.append(
      'attendanceMarkForm',
      new Blob([JSON.stringify(this.attendanceMarkForm.value)], {
        type: 'application/json',
      })
    );

    if (this.isFileSelected) {
      attendanceMarkFormData.append(
        'image',
        this.attendanceMarkForm.get('image')?.value,
        this.attendanceMarkForm.get('image')?.value.name
      );
    } else if (!this.isFileSelected) {
      this.fileButtonDisable = false;
    } else {
      const imageBlob = this.base64ToBlob(
        this.attendanceMarkForm.get('image')?.value,
        this.attendanceMarkForm.get('imageType')?.value
      );
      const file = new File(
        [imageBlob],
        this.attendanceMarkForm.get('imageName')?.value,
        { type: this.attendanceMarkForm.get('imageType')?.value }
      );
      attendanceMarkFormData.append('image', file, file.name);
    }
    return attendanceMarkFormData;
  }

  base64ToBlob(base64: string, mimeType: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }

  public onFileSelected(event: any): void {
    if (event.target.files) {
      const file = event.target.files[0];
      const url = this.sanitizer.bypassSecurityTrustUrl(
        window.URL.createObjectURL(file)
      );
      this.selectedImageUrl = url;
      this.isFileSelected = true;
      this.attendanceMarkForm.get('image')?.setValue(file);
    }
  }

  onSubmit() {
    try {
      this.attendanceMarkService
        .serviceCall(this.attendanceMarkForm.value)
        .subscribe({
          next: (response) => {
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
            console.log('server response:', response);
          },
          error: (error) => {
            this.messageService.showError('Action Failed with Error :' + error);
          },
        });
      this.attendanceMarkForm.disable();
      this.isButtonDisable = true;
      this.fileButtonDisable = true;
    } catch (error) {
      this.messageService.showError('Action Failed with Error:' + error);
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public resetData(): void {
    this.attendanceMarkForm.reset();
    this.attendanceMarkForm.enable();
    this.attendanceMarkForm.get('empId')?.disable();
    this.attendanceMarkForm.get('employeeName')?.disable();
    this.isButtonDisable = false;
    this.fileButtonDisable = false;
    this.attendanceMarkForm.setErrors = null!;
    this.attendanceMarkForm.updateValueAndValidity();
    this.submitted = false;

    this.selectedImageUrl = null;
    this.isFileSelected = false;
  }

  public refreshData(): void {
    this.populateData();
  }
}
