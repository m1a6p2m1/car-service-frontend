import { Component } from '@angular/core';
import { EmployeeStatService } from 'src/app/services/employee-stats/employee-stats.service';

@Component({
  selector: 'app-customer-feedbacks',
  standalone: false,
  templateUrl: './customer-feedbacks.component.html',
  styleUrl: './customer-feedbacks.component.scss'
})
export class CustomerFeedbacksComponent {

  commonTaskGroupChartOptions: any = {};

  constructor(private employeeStatService: EmployeeStatService) {}

  ngOnInit(): void {
    this.populateCustomerFeedbackRates();
  }

  public populateCustomerFeedbackRates(): void {
    this.employeeStatService.customerFeedbackRates().subscribe({
      next: (response: any) => {
        this.updateCustomerFeedbackStats(response);
      },
      error: (error: any) => {
        console.log(error);
      }
    })
  }

  private  updateCustomerFeedbackStats(dataSet: any): void {

    const data = dataSet.map((item: any) => item.cnt);
    const labels = dataSet.map((item: any) => item.quality);

    this.commonTaskGroupChartOptions = {
      series: data,
      chart: {
        type: 'pie',
        height: 350,
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800
        }
      },
      labels: labels,
      colors: ['#483bf6', '#13d1e3', '#f91616', '#da5cf6', '#eeb712'],
      legend: {
        position: 'bottom',
        labels: {
          colors: '#6b7280'
        }
      },
      plotOptions: {
        pie: {
          donut: {
            size: '70%'
          }
        }
      },
      // title: {
      //   text: 'Customer Feedback Ratings',
      //   align: 'center',
      //   style: {
      //     color: '#1f2937',
      //     fontSize: '16px'
      //   }
      // }
    };
  }
}
