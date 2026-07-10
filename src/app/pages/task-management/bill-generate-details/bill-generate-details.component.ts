import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-bill-generate-details',
  standalone: false,
  templateUrl: './bill-generate-details.component.html',
  styleUrl: './bill-generate-details.component.scss'
})
export class BillGenerateDetailsComponent implements OnInit{
  billGeneratedetailsForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data:any
  ){
    this.billGeneratedetailsForm = this.fb.group({
      taskName: [''],
      serviceType: [''],
      servicePrice: [0],
      subTasks: this.fb.array([]),
      totalCost: [0]
    });
  }

  ngOnInit(): void {
    console.log("Bill Data",this.data);
    this.loadTaskDetails();
  }

  get subTasks(): FormArray{
    return this.billGeneratedetailsForm.get('subTasks') as FormArray;
  }

  createSubTask(task:any):FormGroup{
    return this.fb.group({

      description:[task.description],
      subTaskPrice:[task.subTaskPrice]

    });


  }

  loadTaskDetails(){

    this.billGeneratedetailsForm.patchValue({

      taskName: this.data.taskName,
      serviceType: this.data.serviceType,
      servicePrice: this.data.servicePrice

    });


    if(this.data.subTasks){
      this.data.subTasks.forEach((task:any)=>{
        this.subTasks.push(
          this.createSubTask(task)
        );
      });
    }


    this.calculateTotal();

  }

  calculateTotal(){
  }
}
