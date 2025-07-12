import { Component } from '@angular/core';
import { EmployeeStatService } from 'src/app/services/employee-stats/employee-stats.service';

@Component({
  selector: 'app-employee-stats',
  standalone: false,
  templateUrl: './employee-stats.component.html',
  styleUrl: './employee-stats.component.scss'
})
export class EmployeeStatsComponent {

  volumeChartOptions: any = {};
  commonTaskGroupChartOptions: any = {};

  constructor(private employeeStatService: EmployeeStatService) {}

  ngOnInit(): void {
    this.populateCommonServiceStats();
    this.populateEmployeeCountByJobRole();
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

  public populateEmployeeCountByJobRole(): void {
    this.employeeStatService.getEmployeeCountByJobRole().subscribe({
      next: (response: any) => {
        this.updateVolumeChart(response);
      },
      error: (error: any) => {
        console.log(error);
      }
    })
  }

   private updateVolumeChart(dataList: any): void {
    const volumeData = dataList.map((data: any) =>{
      return {
        x: data.title,
        y: data.cnt
      };
    });
    console.log(volumeData);
    
    const seriesData = dataList.map((item: any) => item.cnt);
    const categories = dataList.map((item: any) => item.title);

    this.volumeChartOptions = {
      series: [
        { name: 'Employee Count By Type', data: volumeData }
      ],
      chart: {
        type: 'bar',
        height: 350,
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800
        }
      },
      xaxis: {
        labels: {
          style: {
            colors: '#6b7280'
          }
        }
      },
      yaxis: {
        title: {
          text: 'Count',
          style: {
            color: '#6b7280'
          }
        },
        labels: {
          style: {
            colors: '#6b7280'
          }
        }
      },
      colors: ['#f97316'],
      plotOptions: {
        bar: {
          borderRadius: 4,
          columnWidth: '60%'
        }
      },
      grid: {
        borderColor: '#e5e7eb'
      },
      title: {
        text: 'Employee Count By Type',
        align: 'center',
        style: {
          color: '#1f2937',
          fontSize: '16px'
        }
      }
    };
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
      title: {
        text: 'Customer Used Services',
        align: 'center',
        style: {
          color: '#1f2937',
          fontSize: '16px'
        }
      }
    };
  }
}
