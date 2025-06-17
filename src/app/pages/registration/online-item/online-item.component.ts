import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { OnlineItemService } from 'src/app/services/registration/online-item.service';

@Component({
  selector: 'app-online-item',
  standalone: false,
  templateUrl: './online-item.component.html',
  styleUrl: './online-item.component.scss'
})
export class OnlineItemComponent {
  onlineItemForm: FormGroup;
  displayedColumns: string[] = [
    'itemCode',
    'name',
    'brand',
    'price',
    'action',
  ];

  dataSource!: MatTableDataSource<any>;
  
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    saveButtonLabel = 'Save';
    mode = 'add';
    selectData!: { id: number };
    isButtonDisable = false;
    submitted = false;
    selectedImageUrl!: SafeUrl | null;
    isFileSelected = false;
    fileButtonDisable = false; 


  constructor(
    private fb: FormBuilder,
    private onlineItemService: OnlineItemService,
    private messageService: MessageServiceService,
    private sanitizer: DomSanitizer
  ){
    this.onlineItemForm = this.fb.group({
      itemCode: new FormControl(''),
      name: new FormControl(''),
      description: new FormControl(''),
      brand: new FormControl(''),
      price: new FormControl(''),
      // Quantity: new FormControl(''),
      image: new FormControl(''), //, [Validators.required]
      imageName: new FormControl(''),
      imageType: new FormControl(''),


    });
  }

    ngOnInit(): void {
      this.populateData();
    }
  
    get formControl() {
      return this.onlineItemForm?.controls;
    }
  
    public populateData(): void {
      try {
        this.onlineItemService.getData().subscribe(
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
  
    public prepareItemData(): FormData {
      const onlineItemFormData = new FormData();
      // demoFormData.append('demoForm', this.demoForm.value);
      onlineItemFormData.append(
        'onlineItemForm',
        new Blob([JSON.stringify(this.onlineItemForm.value)], {
          type: 'application/json',
        })
      );
  
      if (this.isFileSelected) {
        onlineItemFormData.append(
          'image',
          this.onlineItemForm.get('image')?.value,
          this.onlineItemForm.get('image')?.value.name
        );
      } else {
        const imageBlob = this.base64ToBlob(
          this.onlineItemForm.get('image')?.value,
          this.onlineItemForm.get('imageType')?.value
        );
        const file = new File(
          [imageBlob],
          this.onlineItemForm.get('imageName')?.value,
          { type: this.onlineItemForm.get('imageType')?.value }
        );
        onlineItemFormData.append('image', file, file.name);
        this.fileButtonDisable = false;
      }
      return onlineItemFormData;
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
  
    onSubmit() {
      // console.log('form submited');
      // console.log('this.onlineItemForm.value');
      try {
        this.submitted = true;
        if (this.onlineItemForm.invalid) {
          return;
        }
  
        if (this.mode === 'add') {
          console.log('Mode:' + this.mode);
          this.onlineItemService.serviceCall(this.prepareItemData()).subscribe({
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
          this.onlineItemService
            .editData(this.selectData.id, this.prepareItemData())
            .subscribe({
              next: (response) => {
                let elementIndex = this.dataSource.data.findIndex(
                  (element) => element.id === this.selectData?.id
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
        this.onlineItemForm.disable();
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
  
    public resetData() {
      this.onlineItemForm.reset();
      this.saveButtonLabel = 'Save';
      this.onlineItemForm.enable();
      this.isButtonDisable = false;
      this.fileButtonDisable = false;
      this.onlineItemForm.setErrors = null!;
      this.onlineItemForm.updateValueAndValidity();
      this.submitted = false;
  
      this.selectedImageUrl = null;
      this.isFileSelected = false;
    }
  
    public onFileSelected(event: any): void {
      if (event.target.files) {
        const file = event.target.files[0];
        const url = this.sanitizer.bypassSecurityTrustUrl(
          window.URL.createObjectURL(file)
        );
        this.selectedImageUrl = url;
        this.isFileSelected = true;
        this.onlineItemForm.get('image')?.setValue(file);
      }
    }
  
    public editData(data: any): void {
      this.onlineItemForm.patchValue(data);
      this.saveButtonLabel = 'Edit';
      this.mode = 'edit';
      this.selectData = data;
  
      const file = data.image;
      const imageType = data.imageType;
      this.selectedImageUrl = `data:${imageType};base64,${file}`;
    }
  
    public deleteData(data: any): void {
      const id = data.id;
      try {
        this.onlineItemService.deleteData(id).subscribe({
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
  
    public refreshData(): void {
      this.populateData();
    }

}
