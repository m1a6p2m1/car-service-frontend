import { Component } from '@angular/core';
import { EmployeeStatService } from 'src/app/services/employee-stats/employee-stats.service';

@Component({
  selector: 'app-task-stats',
  standalone: false,
  templateUrl: './task-stats.component.html',
  styleUrl: './task-stats.component.scss'
})
export class TaskStatsComponent {

  commonTaskGroupChartOptions: any = {};
  
  constructor(private employeeStatService: EmployeeStatService) {}

  ngOnInit(): void {
    this.populateCommonServiceStats();
  }

  public populateCommonServiceStats(): void {
    this.employeeStatService.commonCustomerUseServices().subscribe({
      next: (response: any) => {
        this.updateCommonServiceStats(response);
      },
      error: (error: any) => {
        console.log(error);
      }
    })
  }

  private  updateCommonServiceStats(dataSet: any): void {

    const data = dataSet.map((item: any) => item.cnt);
    const labels = dataSet.map((item: any) => item.name);

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
      colors: ['#3b82f6', '#10b981', '#f97316', '#8b5cf6', '#ef4444', '#06b6d4'],
      legend: {
        position: 'bottom',
        labels: {
          colors: '#6b7280'
        }
      },
      plotOptions: {
        pie: {
          donut: {
            size: '60%'
          }
        }
      },
      // title: {
      //   text: 'Customer Used Services',
      //   align: 'center',
      //   style: {
      //     color: '#1f2937',
      //     fontSize: '16px'
      //   }
      // }
    };
  }
}
