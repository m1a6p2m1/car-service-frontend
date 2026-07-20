import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { AdditionalServicesService } from 'src/app/services/task-management/additional-services.service';
import { TaskAssignService } from 'src/app/services/task-management/task-assign.service';
import { TaskIntroduceService } from 'src/app/services/task-management/task-introduce.service';

@Component({
  selector: 'app-bill-generate-details',
  standalone: false,
  templateUrl: './bill-generate-details.component.html',
  styleUrl: './bill-generate-details.component.scss'
})
export class BillGenerateDetailsComponent implements OnInit{
  billGeneratedetailsForm: FormGroup;
  taskBillDetails: any;
  totalCost = 0;
  isButtonDisable = false;
  billGeneratedButtonLabel = 'Bill Generate';
  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private taskIntroduceService: TaskIntroduceService,
    private additionalServicesService: AdditionalServicesService,
    private taskAssignService: TaskAssignService,
    private messageService: MessageServiceService,
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
      id: [task.id],
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
    this.popultePriceDetails();
  }

  public popultePriceDetails(): void {
    this.populateSubTasksPriceDetails();
  }

  public populateSubTasksPriceDetails(): void {
    const normalize = (s: string) => s?.trim().toLowerCase();
    this.taskIntroduceService.tasksDetailsByTaskName(this.data?.taskName).subscribe((response: any) => {
      this.taskBillDetails = response;
      const subTasksBillDetails: any[] = this.taskBillDetails?.subTasks;

      this.subTasks.controls.forEach(control => {
        const description = control.get('description')?.value;
        const match = subTasksBillDetails.find(p => normalize(p.subTaskName) === normalize(description));
        if (match) {
          control.patchValue({ subTaskPrice: match.subTaskPrice });
        }
      });
      this.populateAdditinalServicePriceDetails();
    });
  }

  public populateAdditinalServicePriceDetails(): void {
    const normalize = (s: string) => s?.trim().toLowerCase();

      this.additionalServicesService.getData().subscribe((resopnse:any)=>{
        const additionalServices: any[] = resopnse;

        this.subTasks.controls.forEach(control => {
          const description = control.get('description')?.value;
          const match = additionalServices.find(p => normalize(p.additionalServicesName) === normalize(description));
          if (match) {
            control.patchValue({ subTaskPrice: match.additionalServicePrice });
          }
        });
        this.calculateTotalCost();
      })
  }

  public calculateTotalCost(): void {
    // Reset total
  this.totalCost = 0;

  // Get service price
  const servicePrice = +this.billGeneratedetailsForm.get('servicePrice')?.value || 0;

  // Add service price first
  this.totalCost += servicePrice;

  // Add all subtask prices
    this.subTasks.controls.forEach(control => {
        const cost = +control.get('subTaskPrice')?.value;
        this.totalCost = this.totalCost + cost;
    });
    // Update form
    this.billGeneratedetailsForm.patchValue({
      totalCost: this.totalCost
    });

    console.log(this.billGeneratedetailsForm.value);
  }

  generateBill(){

    const requestData = {

    subTasks:
    this.billGeneratedetailsForm.value.subTasks

  };


  this.taskAssignService
      .updateSubTaskPrices(
          this.data.id,
          requestData
      )
      .subscribe({

        next:()=>{

          console.log("Step 1: Prices updated successfully");
         //2nd step
         this.taskAssignService.generateBill(this.data.id).subscribe({
          next: (response) => {
            console.log("Step 2: Bill generated", response);
            this.messageService.showSuccess("Bill Generated and Saves Successfully..")
            
          },
          error: (err) =>  {
            console.log("Bill generation error:", err);
            this.messageService.showError("Bill Generation Failed...");
            this.afterSave();
          }
         });

        },

        error:(err)=>{
          console.log("Full error:", JSON.stringify(err));
          console.log("Error status:", err?.status);
          console.log("Error message:", err?.message);
          console.log("Error body:", err?.error);

          this.messageService.showError("Failed to Save Sub Tasks Prices.")

        }

      });

  }

  afterSave() {

    // this.mode = 'view';
    this.billGeneratedetailsForm.disable(); 
    this.isButtonDisable = true;
    this.billGeneratedButtonLabel = 'Bill Generated';
  }
}
