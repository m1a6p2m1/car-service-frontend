import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { GRNServiceService } from 'src/app/services/GRNService/grn-service.service';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { debounceTime } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

interface Items {
  id: number;
  name: string;
  code: string;
}

@Component({
  selector: 'app-grn',
  templateUrl: './grn.component.html',
  styleUrl: './grn.component.scss'
})
export class GrnComponent implements OnInit {

  demoForm: FormGroup;
  innerForm: FormGroup;
  //

  // deletedResponses: any[] = []; // Collection for delete responses

  allOuterBtnDisabled: boolean = false;
  resetOuterDisabled: boolean = false;
  //button disable edit
  editDisable: boolean = false;
  deleteDisable: boolean = false;

  items: any;
  innerColumns: string[] = ['item', 'qty', 'cost', 'actions'];
  dataSource = new MatTableDataSource<any>;

  displayedColumns: string[] = ['grnno', 'supplier', 'tcost', 'actions'];
  dataSourceOuter = new MatTableDataSource<any>;

  //create input

  //filter items
  filteredItems: any;


  //button labels
  saveBtnLabel = 'Save';
  addBtnLabel = 'Add';

  //modes
  innermode = 'inneradd';
  mode = 'Save';

  //selected data for
  selectedData: any;
  innerselectedData: any;

  //button disable
  isButtonDisabled: boolean = true;
  isInnerButtonDisabled: boolean = true;

  //selected rows
  selectedRow: any = null;
  innerselectedRow: any = null;

  //last added row
  lastAddedRow: any = null;
  innerlastAddedRow: any = null;

  //last grn number for get items
  lastGrnNo: any = null;
  allItems: any;
  tcost: number | undefined;
  tableHidden: boolean = true;
  originalData: any;
  isinnerEdit: boolean = false;

  // suppliers
  suppliers: any;
  filteredSuppliers: any;

  processedResponse: any;



  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('input', { static: false }) inputField!: ElementRef; // Reference to the input element
  @ViewChild('formDirective', { static: false }) formDirectiveRef: FormGroupDirective | undefined;
  @ViewChild('innerformDirective', { static: false }) innerformDirectiveRef: FormGroupDirective | undefined;




  constructor(private fb: FormBuilder, private demoService: GRNServiceService, private msgService: MessageServiceService) {

    //main form for add grn
    this.demoForm = this.fb.group({
      grnno: new FormControl(''), //disable field auto generate by adding 1 to last grn number
      supplier: new FormControl('', Validators.required),
      addedUser: new FormControl(localStorage.getItem('user_name')), //get current logged user
      tcost: new FormControl('', Validators.min(1)), //calculate using function
      addedDate: new FormControl(new Date(), Validators.required),


    });

    //inner form for add grn items
    this.innerForm = this.fb.group({
      grnno: new FormControl(''),
      itemID: new FormControl(''),
      item: new FormControl(''),
      expdate: new FormControl('', Validators.required),
      qty: new FormControl('', Validators.required),
      cost: new FormControl('', Validators.required),
      ucost: new FormControl(''),
      avalqty: new FormControl(''), //this is disable field this value get from stock table
      itemCategory: new FormControl(''), //this is disable field this value get from stock table
    });




  }

  ngOnInit(): void {
    this.getItems();
    this.getGrn();
    this.getInnerGRN();
    this.getSuppliers();


    this.demoForm.valueChanges.subscribe(values => {
      // console.log('Form changed:', values);
    });

    this.innerForm.valueChanges.pipe(
      debounceTime(300) // Wait for 300ms of inactivity before emitting
    ).subscribe(values => {
      this.getUnitCost(values.qty, values.cost); // Access values from the object and calculate cost
    });
  }




  dataPopulate(): void {

    try {
      this.demoService.getData().subscribe((response: any) => {
        console.log("get GRN all Server Response", response);

        
        const temp: any[] = [];
        response.forEach((res: any) => {
          let supplierName = this.suppliers.find((sup: any) => sup.supplierId = res.supplier).supplierName;
          let tableRecord = {
            ...res,
            supplierName: supplierName
          };
          console.log(tableRecord);
          temp.push(tableRecord);
        });
        console.log(temp);

        this.dataSourceOuter = new MatTableDataSource(temp);
        this.dataSourceOuter.paginator = this.paginator; // Reassign paginator
        this.dataSourceOuter.sort = this.sort; // Reassign sort
      });
    } catch (error) {
      console.log(error);
    }
  }

  // <mat-select formControlName="item" (selectionChange)="onItemChange($event.value)">
  //this one get the value of changed option and get quantity from stock table of that item
  onItemChange(selectedItem: any): void {

    console.log(selectedItem);

    const newItem = this.items.find((item: { id: any; }) => item.id === selectedItem);
    if (selectedItem) {
      // Patch the itemName to the form control
      this.innerForm.patchValue({ item: newItem?.name });
      this.innerForm.patchValue({itemCategory : newItem.category})
      console.log(newItem?.name);

    }

    if (selectedItem) {

      this.demoService.getQty(selectedItem).subscribe({
        next: (response: any) => {
          console.log("this is item aval qty = " + JSON.stringify(response));
          //patch value to avalqty from responses qty - response is stock object
          this.innerForm.patchValue({ avalqty: response.qty });
        },
        error: (error) => {
          console.log(error);
        }
      });
    } else {
      console.log('No item selected or item ID is undefined');
    }
  }

  onSupplierChange(selectedItem: any) {}

  refreshData() {
    this.selectedRow = null;
    if (this.inputField) {
      this.inputField.nativeElement.value = ''; // Clear the input field
    }
    this.dataSourceOuter.filter = ''; // Clear the filter on the dataSource
    if (this.dataSourceOuter.paginator) {
      this.dataSourceOuter.paginator.firstPage(); // Reset to the first page
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceOuter.filter = filterValue.trim().toLowerCase();
    if (this.dataSourceOuter.paginator) {
      this.dataSourceOuter.paginator.firstPage();
    }
  }

  deleteDataOuter(data: any) {
    const id = data.grnno;
    this.demoService.deleteDataOuter(id).subscribe((response) => {
      console.log("post data Server delete Response", response);
      this.msgService.showSuccess("GRN Record Successfully Deleted");
      this.dataPopulate();
      this.getGrn();
      this.getInnerGRN();
    });
  }


  editDataOuter(data: any) {
    console.log(data);
    this.demoForm.patchValue(data);
    this.demoForm.patchValue({ addedDate: new Date(data.addedDate) })
    this.demoForm.patchValue({
      supplier: +data.supplier
    })
    this.originalData = this.demoForm.value;
    console.log(data.grnno);
    this.saveBtnLabel = 'edit';
    this.mode = 'edit';
    this.selectedData = data;
    this.demoForm.enable();
    this.isButtonDisabled = false;
    this.getInnerGRN();
    this.getItems();
    this.editDisable = false;
    this.deleteDisable = false;

    if (this.selectedRow && this.selectedRow.grnno === data.grnno) {
      this.selectedRow = null; // Toggle off if clicked again
    } else {
      this.selectedRow = data; // Highlight the new row
    }
  }

  //check data changed or not. if not change do nothing and show warning
  checkEdit(formData: any): number {

    // Compare originalData with formData
    const hasChanges = Object.keys(formData).some(key => {
      const originalValue = this.originalData[key];
      const formValue = formData[key];

      console.log(formValue + " this is form value");
      console.log(originalValue + " this is orignal value");


      // Handle null/undefined and empty strings
      const normalizedOriginal = originalValue == null ? '' : originalValue;
      const normalizedForm = formValue == null ? '' : formValue;
      return normalizedOriginal !== normalizedForm;
    });

    if (!hasChanges) {
      this.msgService.showWarining('No changes made');
      this.isButtonDisabled = false;
      return 0;
    } else {
      return 1;

    }
  }


  onSubmit() {
    try {

      if (this.mode === 'edit') {
        const checked = this.checkEdit(this.demoForm.value);
        if (checked == 1 || this.isinnerEdit == true) {
          this.demoService.editDataOuterForm(this.selectedData?.grnno, this.demoForm.value).subscribe({
            next: (response: any) => {
              console.log("put edit data Server Response", response);
              this.msgService.showSuccess("GRN Record Successfully Edited");
              this.dataPopulate();

              setTimeout(() => {
                this.selectedRow = null;
                this.editDisable = true;
                this.deleteDisable = true;
                this.allOuterBtnDisabled = false;
                this.resetOuterDisabled = false;
                this.isButtonDisabled = true;
                this.demoForm.disable();
                this.isinnerEdit = false;

              }, 1000);
            },
            error: (error) => {
              console.log(error);
              this.msgService.showError("Error in Edit Record" + error)
            }
          });
        } else {
          setTimeout(() => {
            this.isButtonDisabled = false;
          }, 500);
        }


      } else if (this.mode === 'Save') {

        //take grn number from demoForm current grn
        const grnnum = this.demoForm.get('grnno')?.value; // Access the value of the FormControl
        this.demoForm.patchValue({ grnno: grnnum });

        this.demoService.serviceCallPost(this.demoForm.value).subscribe((response) => {
          this.dataSourceOuter = new MatTableDataSource([response, ...this.dataSourceOuter.data]);
          this.dataSourceOuter.paginator = this.paginator; // Reassign paginator
          this.dataSourceOuter.sort = this.sort; // Reassign sort

          console.log("post data Server Response", response);
          this.msgService.showSuccess("GRN Record Successfully Added");

          this.lastAddedRow = response; // Track the last added row
          console.log('Added new row:', response);


          setTimeout(() => {
            this.editDisable = true;
            this.deleteDisable = true;
            this.allOuterBtnDisabled = false;
            this.resetOuterDisabled = false;
            this.getInnerGRN();
            this.lastAddedRow = null;
            this.dataPopulate();
          }, 1000);

          setTimeout(() => {
            this.isButtonDisabled = true;
            this.demoForm.disable();
          }, 500);


          try {
            //this all items are innergrn records for one grn ex- grnno = 20 there are 3 innergrn records
            const itemList = this.allItems;
            console.log('items:', itemList);

            //send those items list to backend
            this.demoService.stockUpdate(itemList).subscribe({
              next: (response) => {
                console.log("post data Server Response", response);
              },
              error: (error) => {
                console.error('Stock update error:', error);
              }
            });
          } catch (e) {
            console.error('Error in stockUpdate block:', e);
          }


        });
      }

    } catch (error) {
      console.log(error);
      this.msgService.showError("Error " + error);
    }

  }


  onSubmitInner() {

    try {

      if (this.innermode === 'inneredit') {

        // for checkEdit function. confirm theres inner edit
        this.isinnerEdit = true;

        console.log(JSON.stringify(this.innerForm.value) + "on edit inner");


        this.demoService.innerEditData(this.innerselectedData?.id, this.innerForm.value).subscribe({
          next: (response: any) => {
            console.log("put data Server Response", response);
            this.msgService.showSuccess("Inner Record Successfully Edited");
            this.getInnerGRN();
            this.innerForm.disable();

            this.resetOuterDisabled = true;
            this.allOuterBtnDisabled = true;


            setTimeout(() => {
              this.innerselectedRow = null;
              if (this.mode == 'edit') {
                const innerItem = response;
                // alert(JSON.stringify(response) + "added response");
                this.demoService.stockUpdateEdit(innerItem).subscribe((response) => {
                  console.log("post data Server Stock update edit Response", response);
                });
              }
            }, 1000);
          },
          error: (error) => {
            console.log(error);
            this.msgService.showError("Error in Edit Record" + error)
          }
        });

      } else if (this.innermode === 'inneradd') {


        console.log("before" + this.innerForm);

        //take grn number from demoForm current grn
        const grnnum = this.demoForm.get('grnno')?.value; // Access the value of the 'id' FormControl
        this.innerForm.patchValue({ grnno: grnnum });

        const unitCost = this.innerForm.get('ucost')?.value;
        this.innerForm.patchValue({ ucost: unitCost })

        console.log("Inner Form before submit" + JSON.stringify(this.innerForm.value));

        this.demoService.serviceCallPostInner(this.innerForm.value).subscribe({
          next: (response) => {
            console.log("post data Server Response", response);
            this.msgService.showSuccess("Inner Record Successfully Added");

            this.innerlastAddedRow = response; // Track the last added row for CSS (make green color for 3 secs)
            console.log('Added new row:', response);
            this.resetOuterDisabled = true;
            this.allOuterBtnDisabled = true;

            // When a record is inserted, show the table - tableHidden is bound with [hidden] = 'tableHidden'
            this.tableHidden = false;
            this.getInnerGRN();

            setTimeout(() => {
              // After 3 seconds, remove green color
              this.innerlastAddedRow = null;

              if (this.mode === 'edit') {
          const innerItem = response;
          this.demoService.stockUpdateEdit(innerItem).subscribe({
            next: (updateResponse) => {
              console.log("post data Server inner delete Response", updateResponse);
            },
            error: (updateError) => {
              console.error("Error occurred during stock update:", updateError);
            }
          });
              }

              this.filterItems();

            }, 3000);
          },
          error: (error) => {
            console.error("Error occurred while adding inner record:", error);
            this.msgService.showError("Error in Adding Inner Record: " + error.message);
          }
        });

        setTimeout(() => {
          this.isInnerButtonDisabled = true;
          this.innerForm.disable();
          this.calculateTotalCost();
        }, 500);


      }
    } catch (error) {
      console.log(error);
      this.msgService.showError("Error " + error);

    }

  }


  resetData(formDirective: FormGroupDirective) {
    this.demoForm.enable();
    formDirective.resetForm();
    this.demoForm.reset();
    this.saveBtnLabel = 'Save';
    this.mode = 'Save';
    this.isButtonDisabled = true;
    this.selectedRow = null;
    this.innerformDirectiveRef?.resetForm();

    setTimeout(() => {
      this.getGrn();
      this.getInnerGRN();
      this.getItems();
      this.demoForm.patchValue({ addedDate: new Date() })
      this.demoForm.patchValue({ addedUser: localStorage.getItem('user_name') })
      this.editDisable = false;
      this.deleteDisable = false;
      this.allOuterBtnDisabled = false;
    }, 500);
  }


  resetInner(innerformDirective: FormGroupDirective) {

    innerformDirective.resetForm();
    this.innerForm.reset();
    this.innermode = 'inneradd';
    this.addBtnLabel = 'Add';
    this.innerForm.enable();

    setTimeout(() => {
      this.innerselectedRow = null;
    }, 500);

  }

  //get items to the select option drop down
  getItems(): void {
    this.demoService.getItem().subscribe({
      next: (response: any) => {
        console.log(response);
        this.filteredItems = response;
        this.items = response;

      },
      error: (error) => {
        console.log(error);
      }
    });
  }

    getSuppliers(): void {
    this.demoService.getSuppliers().subscribe({
      next: (response: any) => {
        console.log(response);
        this.filteredSuppliers = response;
        this.suppliers = response;
        this.dataPopulate();

      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  filterItems() {
    const allItems = this.items;
    const selectedItems = this.allItems;

    console.log(allItems);
    console.log(selectedItems);

    // const selecteditemIDs = selectedItems.map((item: { itemID: any; }) => item.itemID);
    // const allItemIDs = allItems.map((item: { id: any; }) => item.id);

    this.filteredItems = allItems.filter((item: { id: any; }) =>
      !selectedItems.some((selected: { itemID: any; }) => selected.itemID === item.id)
    );

    console.log(this.items);

  }

  //get inner table values for current grn nuber
  getInnerGRN(): void {
    setTimeout(() => {

      //get current grn from demoForm
      const grnnum = this.demoForm.get('grnno')?.value;

      this.demoService.getInnerGRN(grnnum).subscribe({
        next: (response: any) => {
          //set response to table
          this.dataSource = response;

          //create a variable and assign response to it for stock update
          this.allItems = response;

          if (response.length < 2) {
            if (this.mode == 'edit') {
              this.deleteDisable = true;
            }
          } else {
            if (this.mode == 'edit') {
              this.deleteDisable = false;
            }
          }

          //if there are no rows in inner table hide table headers
          if (response == "") {
            this.tableHidden = true;
            this.resetOuterDisabled = false;
          } else {
            this.tableHidden = false;
          }
          this.calculateTotalCost();
        },
        error: (error) => {
          console.log(error);
        }
      });
    }, 500);
  }

  //get the next grn number
  getGrn(): void {
    this.demoService.getGRNs().subscribe({
      next: (response: any) => {

        if (response == "") {
          this.demoForm.patchValue({ grnno: 1 });
        } else {
          // Get the last element of the array
          const lastGrnObject = response[response.length - 1];
          console.log(lastGrnObject.grnno);

          // Extract the grnno from the last object
          this.lastGrnNo = lastGrnObject.grnno;
          console.log('Last GRN Number:', this.lastGrnNo);
          this.demoForm.patchValue({ grnno: this.lastGrnNo + 1 });
        }


      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }




  //get unit cost by dividing cost by qty
  getUnitCost(quantity: any, cost: any): void {
    const ucostControl = this.innerForm.get('ucost');
    const qtyValue = parseFloat(quantity);
    const costValue = parseFloat(cost);

    if (!isNaN(qtyValue) && !isNaN(costValue) && qtyValue > 0) {
      const unitCost = costValue / qtyValue;
      ucostControl?.setValue(unitCost.toFixed(2));

    } else {
      ucostControl?.setValue(0); // Clear unit cost if quantity is zero or invalid
    }
  }

  //calculate total cost from all innertable costs
  calculateTotalCost(): void {
    //allitems are response from all inner table objects for a grn number
    const itemList = this.allItems;

    const ttcost = itemList?.length ? itemList.reduce((sum: any, item: { cost: any; }) => sum + item.cost, 0) : 0;
    this.demoForm.patchValue({ tcost: ttcost });
  }

  deleteInnerData(data: any) {
    const id = data.id;
    this.demoService.deleteInnerData(id).subscribe((response) => {
      console.log("post data Server Response", response);
      // this.deletedResponses.push(response);
      // console.log(this.deletedResponses);
      this.getInnerGRN();
      this.msgService.showSuccess("Inner Record Successfully Deleted");

      if (this.mode == 'edit') {
        this.allOuterBtnDisabled = true;
        this.resetOuterDisabled = true;

        const innerItem = response;
        alert(JSON.stringify(response) + "added response")
        this.demoService.stockUpdateEdit(innerItem).subscribe((response) => {
          console.log("post data Server delete Response", response);
        });
      }

    });
  }

  editInnerData(data: any) {

    //in inner form formcontrol expect item as a object
    // this.filterItems();
    this.innerForm.patchValue(data);
    this.innerForm.patchValue({ expdate: new Date(data.expdate) });

    console.log(this.innerForm.value);
    this.onItemChange(data.itemID);
    this.addBtnLabel = 'Edit';
    this.innermode = 'inneredit';
    this.innerselectedData = data;
    this.innerForm.enable();
    this.isInnerButtonDisabled = false;

    setTimeout(() => {

    }, 1000);


    if (this.innerselectedRow && this.innerselectedRow.id === data.id) {
      this.innerselectedRow = null; // Toggle off if clicked again
    } else {
      this.innerselectedRow = data; // Highlight the new row
    }
  }


}



