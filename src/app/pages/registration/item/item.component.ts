import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { elementAt } from 'rxjs';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { ItemService } from 'src/app/services/registration/item.service';

//  const ELEMENT_DATA: any[] = [{ itemCode: '', itemName: '', itemCategory: '', supplierName: '', brandName:'', description:''}];

@Component({
  selector: 'app-item',
  standalone: false,
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss',
})
export class ItemComponent implements OnInit {
  itemForm: FormGroup;
  displayedColumns: string[] = [
    'itemCode',
    'itemName',
    'itemCategory',
    'supplierName',
    'brandName',
    'action',
  ];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  saveButtonLabel = 'Save';
  mode = 'add';
  selectData!: { itemId: number };
  isButtonDisable = false;
  submitted = false;
  imagePreview!: string;
  selectedFile: File | null = null;
  imageData: any;

  constructor(
    private fb: FormBuilder,
    private itemService: ItemService,
    private messageService: MessageServiceService
  ) {
    this.itemForm = this.fb.group({
      itemCode: new FormControl(''),
      itemName: new FormControl('', [Validators.required]),
      itemCategory: new FormControl(''),
      supplierName: new FormControl('', [Validators.required]),
      brandName: new FormControl(''),
      description: new FormControl(''),
      itemImage: new FormControl(null),
    });
  }

  ngOnInit(): void {
    this.populateData();
  }

  public populateData(): void {
    try {
      this.itemService.getData().subscribe(
        (response: any) => {
          this.dataSource = new MatTableDataSource(response);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        (error) => {
          this.messageService.showError('Action Failed with Error :' + error);
        }
      );
    } catch (error) {
      this.messageService.showError('Action Failed with Error:' + error);
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      this.itemForm.patchValue({
        itemImage: this.selectedFile,
      });

      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.imageData = event.target.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSubmit() {
    try {
      this.submitted = true;
      if (this.itemForm.invalid) {
        return;
      }

      const formData = new FormData();
      formData.append('itemCode', this.itemForm.get('itemCode')?.value);
      formData.append('itemName', this.itemForm.get('itemName')?.value);
      formData.append('itemCategory', this.itemForm.get('itemCategory')?.value);
      formData.append('supplierName', this.itemForm.get('supplierName')?.value);
      formData.append('brandName', this.itemForm.get('brandName')?.value);
      formData.append('description', this.itemForm.get('description')?.value);
      formData.append('itemImage', this.itemForm.get('itemImage')?.value);

      if (this.mode === 'add') {
        console.log('Mode:' + this.mode);
        this.itemService.serviceCall(formData).subscribe({
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
          },
          error: (error) => {
            this.messageService.showError('Action Failed with Error :' + error);
          },
        });
      } else if (this.mode === 'edit') {
        console.log('Mode:' + this.mode);
        this.itemService
          .editData(this.selectData.itemId, this.itemForm.value)
          .subscribe({
            next: (response) => {
              let elementIndex = this.dataSource.data.findIndex(
                (element) => element.itemId === this.selectData?.itemId
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
      this.itemForm.disable();
      this.isButtonDisable = true;
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

  public resetData() {
    this.itemForm.reset();
    this.saveButtonLabel = 'Save';
    this.itemForm.enable();
    this.isButtonDisable = false;
    this.itemForm.setErrors = null!;
    this.itemForm.updateValueAndValidity();
    this.submitted = false;
    this.selectedFile = null;
    this.imageData = null;
  }

  public editData(data: any): void {
    this.itemForm.patchValue(data);
    this.saveButtonLabel = 'Edit';
    this.mode = 'edit';
    this.selectData = data;
    this.imageData = `data:image/jpeg;base64,${data.itemImage}`;
  }

  public deleteData(data: any): void {
    const itemId = data.itemId;
    try {
      this.itemService.deleteData(itemId).subscribe({
        next: (response: any) => {
          const index = this.dataSource.data.findIndex(
            (element) => element.itemId === itemId
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

  public refreshData(): void {
    this.populateData();
  }
}
