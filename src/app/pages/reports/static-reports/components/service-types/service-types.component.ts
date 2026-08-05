import { Component } from '@angular/core';
import { EmployeeStatService } from 'src/app/services/employee-stats/employee-stats.service';

@Component({
  selector: 'app-service-types',
  standalone: false,
  templateUrl: './service-types.component.html',
  styleUrl: './service-types.component.scss'
})
export class ServiceTypesComponent {

  volumeChartOptions: any = {};

  constructor(private employeeStatService: EmployeeStatService) {}
  
    ngOnInit(): void {
      this.populateServiceCount();
    }


  public populateServiceCount(): void {
    this.employeeStatService.getServiceTypeCount().subscribe({
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
        x: data.service,
        y: data.cnt
      };
    });
    console.log(volumeData);
    
    const seriesData = dataList.map((item: any) => item.cnt);
    const categories = dataList.map((item: any) => item.service);

    this.volumeChartOptions = {
      series: [
        { name: 'Service Count By Type', data: volumeData }
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
      colors: ['#03a30e'],
      plotOptions: {
        bar: {
          borderRadius: 4,
          columnWidth: '50%'
        }
      },
      grid: {
        borderColor: '#e5e7eb'
      },
      // title: {
      //   text: 'Service Type Count',
      //   align: 'center',
      //   style: {
      //     color: '#1f2937',
      //     fontSize: '16px'
      //   }
      // }
    };
  }

}
