import { V } from '@angular/cdk/keycodes';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder,FormGroup, FormControl, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormDemoServiceService } from 'src/app/services/form-demo/form-demo-service.service';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';

const ELEMENT_DATA: any[] = [{firstName: '1', lastName: '1', age: '1', email: 'c@gmail.com', action:''}];

@Component({
  selector: 'app-form-demo',
  standalone: false,
  templateUrl: './form-demo.component.html',
  styleUrl: './form-demo.component.scss'
})
export class FormDemoComponent implements OnInit {
/**formbuilder formgroup formcontroller --- Reactive form module*/
/**firstName lastName age email */

  demoForm: FormGroup;

  displayedColumns: string[] = ['firstName', 'lastName', 'age', 'email', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  saveButtonLabel = 'Save';
  mode = 'add';
  selectedData!: { id: number; };
  isButtonDisabled = false;
  submitted = false ;

  constructor(
    private fb: FormBuilder , 
    private demoService: FormDemoServiceService,
    private messageService: MessageServiceService
  ){
    this.demoForm = this.fb.group({
      firstName: new FormControl('', [Validators.required]),//
      lastName: new FormControl('', [Validators.minLength(3), Validators.maxLength(8)]),
      age: new FormControl('', [Validators.min(1), Validators.max(120)]),
      email: new FormControl('', [Validators.email])
    });
  }

  onSubmit(){
    console.log("Mode "+ this.mode);
    console.log("Form Submited");
    console.log(this.demoForm.value);

    try {

      this.submitted = true;
      if (this.demoForm.invalid) {
        return;
      }
      if (this.mode === 'add') {
        // this.demoService.serviceCall(this.demoForm.value).subscribe((response)=>{
        //   if (this.dataSource && this.dataSource.data && this.dataSource.data.length>0) {
        //     this.dataSource = new MatTableDataSource([response, ...this.dataSource.data]);
        //   }
        //   this.dataSource = new MatTableDataSource([response]);

        //   this.messageService.showSuccess('Data saved Successfully !');
        // });
        this.demoService.serviceCall(this.demoForm.value).subscribe({
          next: (response: any) =>{
            if (this.dataSource && this.dataSource.data && this.dataSource.data.length>0) {
                  this.dataSource = new MatTableDataSource([response, ...this.dataSource.data]);
                }
                this.dataSource = new MatTableDataSource([response]);
      
                this.messageService.showSuccess('Data saved Successfully !');
            },
            error: (error)=>{
              this.messageService.showError('Action Failed with Error :'+ error);
            }
        });
      }else if (this.mode === 'edit') {
        // this.demoService.editData(this.selectedData?.id ,this.demoForm.value).subscribe((response)=>{

        //   let elementIndex = this.dataSource.data.findIndex((element) => element.id === this.selectedData?.id);
        //   this.dataSource.data[elementIndex] = response;
        //   this.dataSource = new MatTableDataSource(this.dataSource.data);

        //   this.messageService.showSuccess('Data Edited Successfully !');
        // });  
        this.demoService.editData(this.selectedData?.id ,this.demoForm.value).subscribe({
          next: (response: any) =>{
            let elementIndex = this.dataSource.data.findIndex((element) => element.id === this.selectedData?.id);
            this.dataSource.data[elementIndex] = response;
            this.dataSource = new MatTableDataSource(this.dataSource.data);

            this.messageService.showSuccess('Data Edited Successfully !');
          },
          error: (error)=>{
            this.messageService.showError('Action Failed with Error :'+ error);
          }
        });
      }
      this.demoForm.disable();
      this.isButtonDisabled = true;
    } catch (error) {
      this.messageService.showError('Action Failed with Error :'+ error);
    }
    
  }

  public resetData(): void{
    this.demoForm.reset();
    this.saveButtonLabel ="Save";
    this.demoForm.enable();
    this.isButtonDisabled = false;
    this.demoForm.setErrors = null!;
    this.demoForm.updateValueAndValidity();
    this.submitted = false;
    this.ngOnInit();
  }

  ngOnInit(): void{
    // console.log('oninit')
    this.populateData();
  }

  //table data filtering
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public populateData(): void{
    try {
      this.demoService.getData().subscribe((response:any)=>{
        console.log('get data response: ', response);
  
        this.dataSource = new MatTableDataSource(response);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error)=>{
        this.messageService.showError('Action Failed with Error :'+ error);
      }
      );
    } catch (error) {
      this.messageService.showError('Action Failed with Error :'+ error);
    }
    
  }

  // public populateData(): void{
  //   try {
  //     this.demoService.getData().subscribe({
  //       next: (dataList: any[]) => {
  //         if (dataList.length <= 0) {
  //          return;
  //         }
  //         this.dataSource = new MatTableDataSource(dataList);
  //         this.dataSource.paginator = this.paginator;
  //         this.dataSource.sort = this.sort;
  //       },
  //       error: (error)=>{
  //         this.messageService.showError('Action Failed with Error :'+ error);
  //       }
  //     });
  //   } catch (error) {
  //     this.messageService.showError('Action Failed with Error :'+ error);
  //   }
    
  // }


  public editData(data:any): void{
    console.log("Mode "+ this.mode);
    this.demoForm.patchValue(data);
    this.saveButtonLabel ="Edit";
    this.mode = 'edit';
    this.selectedData = data;
    
    
  }

  public deleteData(data: any): void{
    //data delete implementation
    const id = data.id;
    try {
      // this.demoService.deleteData(id).subscribe((response:any) =>{
      //   const index = this.dataSource.data.findIndex((element) => element.id === id);
  
      //   if(index !== -1){
      //     this.dataSource.data.splice(index, 1);
      //   }
      //   this.dataSource = new MatTableDataSource(this.dataSource.data);

      //   this.messageService.showSuccess('Data Deleted Successfully !');
      // });
      this.demoService.deleteData(id).subscribe({
        next: (respose: any) => {
          const index = this.dataSource.data.findIndex((element) => element.id === id);
  
          if(index !== -1){
            this.dataSource.data.splice(index, 1);
          }
          this.dataSource = new MatTableDataSource(this.dataSource.data);

          this.messageService.showSuccess('Data Deleted Successfully !');
        },
        error: (error)=>{
          this.messageService.showError('Action Failed with Error :'+ error);
        }
      });
    } catch (error) {
      this.messageService.showError('Action Failed with Error :'+ error);
    }
    
  }

  public refreshData(): void{
    this.populateData();
  }
}
