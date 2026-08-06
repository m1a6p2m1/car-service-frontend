import { Component, ViewChild } from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexPlotOptions,
  ApexTitleSubtitle,
  ApexYAxis,
} from 'ng-apexcharts';
import { AppointmentTypeCount } from 'src/app/models/appointment.model';
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
  selector: 'app-service-type-by-date',
  templateUrl: './service-type-by-date.component.html',
  styleUrl: './service-type-by-date.component.scss',
})
export class ServiceTypeByDateComponent {
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
      .getCountsByType(this.fromDate, this.toDate)
      .subscribe({
        next: (response: any) => {
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
        x: data.appointmentType,
        y: data.count,
      };
    });
    console.log(volumeData);

    this.volumeChartOptions = {
      series: [{ name: 'Appointment Count By Type', data: volumeData }],
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
      colors: ['#f97316'],
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
  }
}
