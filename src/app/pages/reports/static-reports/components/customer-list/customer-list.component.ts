import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { CustomerListService } from 'src/app/services/print-service/customer-list.service';
import { PrintService } from 'src/app/services/print-service/print.service';
import { CustomerService } from 'src/app/services/registration/customer.service';

@Component({
  selector: 'app-customer-list',
  standalone: false,
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.scss'
})
export class CustomerListComponent implements OnInit {
  displayedColumns: string[] = [
    'firstName',
    'lastName',
    'email',
    'contactNumber'
  ];

  dataSource!: MatTableDataSource<any>;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    filteredCustomers: any[] = [];

  constructor(
      private messageService: MessageServiceService,
      private customerListService: CustomerListService,
      private customerService: CustomerService
    ) {}

  ngOnInit(): void {
    this.populateData();
  }

  public populateData(): void {
      try {
        this.customerService.getAllCustomer().subscribe(
          (response: any) => {
            console.log('server response: ', response);
            this.dataSource = new MatTableDataSource(response);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.filteredCustomers = this.dataSource.data;
          },
          (error) => {
            this.messageService.showError('Action Failed with Error :' + error);
          }
        );
      } catch (error) {
        this.messageService.showError('Action Failed with Error :' + error);
      }
    }

    applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    this.filteredCustomers = this.dataSource.filteredData;

    // pagination code
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public refreshData(): void {
    this.populateData();
  }

  printReport(): void {
    this.customerListService.printCustomersReport(this.filteredCustomers);
  }
}
