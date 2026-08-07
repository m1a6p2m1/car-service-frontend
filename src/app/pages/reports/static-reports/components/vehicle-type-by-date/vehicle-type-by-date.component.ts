import { Component } from '@angular/core';
import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexYAxis, ApexDataLabels, ApexPlotOptions, ApexTitleSubtitle } from 'ng-apexcharts';
import { AppointmentService } from 'src/app/services/appointment.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-vehicle-type-by-date',
  standalone: false,
  templateUrl: './vehicle-type-by-date.component.html',
  styleUrl: './vehicle-type-by-date.component.scss'
})
export class VehicleTypeByDateComponent {
  fromDate = '';
    toDate = '';
    loading = false;
    errorMsg = '';
  
    volumeChartOptions: any = {};
  
    constructor(private appointmentReportService: AppointmentService) {}
  
    public fetchData(): void {
      this.errorMsg = '';
  
      if (!this.fromDate || !this.toDate) {
        this.errorMsg = 'Please select both From and To dates.';
        return;
      }
      if (this.fromDate > this.toDate) {
        this.errorMsg = 'From date cannot be after To date.';
        return;
      }
  
      this.loading = true;
      this.appointmentReportService
        .getCountsByVehicleType(this.fromDate, this.toDate)
        .subscribe({
          next: (response: any) => {
            console.log('API Response:', response);
            console.log('API Response:', response);
            console.log('First Item:', response[0]);

            response.forEach((item: any) => {
              console.log(item);
              console.log('Vehicle Type:', item.vehicleType);
              console.log('Count:', item.count);
            });

            this.updateVolumeChart(response);
            this.loading = false;
          },
          error: (error: any) => {
            console.log(error);
            this.errorMsg = 'Failed to load report.';
            this.loading = false;
          },
        });
    }
  
    private updateVolumeChart(dataList: any): void {
      const volumeData = dataList.map((data: any) => {
        return {
          x: data.vehicle,
          y: data.count,
        };
      });
      console.log(volumeData);
  
      this.volumeChartOptions = {
        series: [{ name: 'Vehicle Count By Type', data: volumeData }],
        chart: {
          type: 'bar',
          height: 350,
          animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800,
          },
        },
        xaxis: {
          labels: {
            style: {
              colors: '#6b7280',
            },
          },
        },
        yaxis: {
          title: {
            text: 'Count',
            style: {
              color: '#6b7280',
            },
          },
          labels: {
            style: {
              colors: '#6b7280',
            },
          },
        },
        colors: ['#850299'],
        plotOptions: {
          bar: {
            borderRadius: 4,
            columnWidth: '50%',
          },
        },
        grid: {
          borderColor: '#e5e7eb',
        },
      };
      console.log('Chart Options:', this.volumeChartOptions);
    }
}
