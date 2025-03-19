import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { ItemService } from 'src/app/services/registration/item.service';

//  const ELEMENT_DATA: any[] = [{ itemCode: '', itemName: '', itemCategory: '', supplierName: '', brandName:'', description:''}];


@Component({
  selector: 'app-item',
  standalone: false,
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss'
})
export class ItemComponent implements OnInit{


  itemForm: FormGroup;
  displayedColumns: string[] = ['itemCode', 'itemName', 'itemCategory', 'supplierName', 'brandName', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  saveButtonLabel = 'Save';
  mode = 'add';
  selectData!: {itemId: number};
  isButtonDisable = false;
  submitted = false;
  selectedImageUrl!: SafeUrl | null;
  isFileSelected = false;
  fileButtonDisable = false;//<----

  constructor(
    private fb: FormBuilder,
    private itemService: ItemService,
    private messageService: MessageServiceService,
    private sanitizer: DomSanitizer
  ){
    this.itemForm = this.fb.group({

      itemCode: new FormControl(''),
      itemName: new FormControl('', [Validators.required]),
      itemCategory: new FormControl(''),
      supplierName: new FormControl('', [Validators.required]),
      brandName: new FormControl(''),
      description: new FormControl(''),
      image: new FormControl('', [Validators.required]),
      imageName: new FormControl(''),
      imageType: new FormControl('')

    });
  }

  ngOnInit():void{
    this.populateData();
  }

  get formControl() {
    return this.itemForm?.controls;
  }

  public populateData(): void{
    try{
      this.itemService.getData().subscribe((response:any)=>{
        this.dataSource = new MatTableDataSource(response);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
      },
      (error)=>{this.messageService.showError('Action Failed with Error :'+ error);});
    }catch(error){
      this.messageService.showError('Action Failed with Error:' + error);
    }
  }

  public prepareItemData(): FormData {
    const itemFormData = new FormData();
    // demoFormData.append('demoForm', this.demoForm.value);
    itemFormData.append('itemForm', new Blob([JSON.stringify(this.itemForm.value)], { type: 'application/json' }));

    if (this.isFileSelected) {
      itemFormData.append('image', this.itemForm.get('image')?.value, this.itemForm.get('image')?.value.name);
    } else if(!this.isFileSelected){
      this.fileButtonDisable = false;
    }else {
      const imageBlob = this.base64ToBlob(this.itemForm.get('image')?.value, this.itemForm.get('imageType')?.value);
      const file = new File([imageBlob], this.itemForm.get('imageName')?.value, { type: this.itemForm.get('imageType')?.value });
      itemFormData.append('image', file, file.name);
    }
    return itemFormData;
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
  

  onSubmit(){
    // console.log('form submited');
    // console.log('this.itemForm.value');
    try{
      this.submitted = true;
      if (this.itemForm.invalid) {
        return;
      }

      if (this.mode === 'add') {
        console.log("Mode:"+ this.mode);
        this.itemService.serviceCall(this.prepareItemData()).subscribe({ 
          next:(response)=>{
            if (this.dataSource && this.dataSource.data && this.dataSource.data.length>0) {
              this.dataSource = new MatTableDataSource([response,...this.dataSource.data]);
            }
            this.dataSource = new MatTableDataSource([response]);
            this.messageService.showSuccess('Data Saved Successfully !');
          },
          error:(error)=>{
            this.messageService.showError('Action Failed with Error :'+ error);
          }
        });
      } else if (this.mode === 'edit'){
        console.log("Mode:"+ this.mode);
        this.itemService.editData(this.selectData.itemId, this.prepareItemData()).subscribe({  
          next:(response)=>{
            let elementIndex = this.dataSource.data.findIndex((element)=> element.itemId === this.selectData?.itemId);
            this.dataSource.data[elementIndex] = response;
            this.dataSource = new MatTableDataSource(this.dataSource.data);
            this.messageService.showSuccess('Data Edited Successfully !');
          },
          error:(error)=>{
            this.messageService.showError('Action Failed with Error :'+ error);
          }
        });
      }
      this.itemForm.disable();
      this.isButtonDisable = true;
      this.fileButtonDisable = true;
    }catch(error){
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

  public resetData(){
    this.itemForm.reset();
    this.saveButtonLabel = 'Save';
    this.itemForm.enable();
    this.isButtonDisable = false;
    this.fileButtonDisable = false;
    this.itemForm.setErrors = null!;
    this.itemForm.updateValueAndValidity();
    this.submitted = false;

    this.selectedImageUrl = null;
    this.isFileSelected = false;
  }

  public onFileSelected(event:any): void {
    if (event.target.files) {
      const file = event.target.files[0];
      const url = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file));
      this.selectedImageUrl = url;
      this.isFileSelected = true;
      this.itemForm.get('image')?.setValue(file);
    }
  }

  

  public editData(data:any): void{
    this.itemForm.patchValue(data);
    this.saveButtonLabel = 'Edit';
    this.mode = 'edit';
    this.selectData = data;

    const file = data.image;
    const imageType = data.imageType;
    this.selectedImageUrl = `data:${imageType};base64,${file}`;

  }

  public deleteData(data:any): void{
    const itemId = data.itemId;
    try{
      this.itemService.deleteData(itemId).subscribe({
        next:(response:any)=>{
          const index = this.dataSource.data.findIndex((element)=>element.itemId === itemId);
          if (index !== -1) {
            this.dataSource.data.splice(index,1);
          }
          this.dataSource = new MatTableDataSource(this.dataSource.data);
          this.messageService.showSuccess('Data Deleted Successfully !');
        },
        error:(error)=>{
          this.messageService.showError('Action Failed with Error :'+ error);
        }
      });
    }catch(error){
      this.messageService.showError('Action Failed with Error:' + error);
    }
  }

  public refreshData(): void{
    this.populateData();
  }

}
