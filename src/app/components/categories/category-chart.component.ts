import { Component, Input, OnChanges, SimpleChanges, ViewChild, ChangeDetectionStrategy, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  ChartComponent,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ApexStroke,
  ApexDataLabels,
  ApexLegend,
  ApexTooltip,
  NgApexchartsModule
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  colors: string[];
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  tooltip: ApexTooltip;
};

@Component({
  selector: 'app-category-chart',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="chart-container relative">
      @if (isBrowser) {
        <apx-chart
          [series]="chartOptions.series"
          [chart]="chartOptions.chart"
          [labels]="chartOptions.labels"
          [colors]="chartOptions.colors"
          [responsive]="chartOptions.responsive"
          [stroke]="chartOptions.stroke"
          [dataLabels]="chartOptions.dataLabels"
          [legend]="chartOptions.legend"
          [tooltip]="chartOptions.tooltip"
        ></apx-chart>
      }
    </div>
  `,
  styles: [`
    :host { display: block; width: 100%; }
    .chart-container { min-height: 300px; }
  `]
})
export class CategoryChartComponent implements OnChanges {
  @Input() data: { name: string, amount: number, color: string }[] = [];
  @Input() type: 'donut' | 'pie' | 'bar' = 'donut';
  @Input() title: string = '';

  private platformId = inject(PLATFORM_ID);
  isBrowser = isPlatformBrowser(this.platformId);

  public chartOptions: Partial<ChartOptions> | any;

  constructor() {
    this.initChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.updateChart();
    }
  }

  private initChart() {
    this.chartOptions = {
      series: [],
      chart: {
        type: this.type,
        height: 320,
        background: 'transparent',
        foreColor: '#B0A8C0',
        toolbar: { show: false },
        animations: { enabled: true, easing: 'easeinout', speed: 800 }
      },
      labels: [],
      colors: [],
      stroke: { show: false },
      dataLabels: {
        enabled: true,
        formatter: (val: any) => `${Math.round(val)}%`,
        style: {
          fontSize: '10px',
          fontFamily: 'inherit',
          fontWeight: '900'
        },
        dropShadow: { enabled: false }
      },
      legend: {
        position: 'bottom',
        fontSize: '10px',
        fontWeight: '700',
        fontFamily: 'inherit',
        markers: { radius: 12 },
        itemMargin: { horizontal: 10, vertical: 5 }
      },
      tooltip: {
        theme: 'dark',
        y: {
          formatter: (val: number) => `$ ${val.toLocaleString()}`
        }
      },
      plotOptions: {
        pie: {
          donut: {
            size: '75%',
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '10px',
                fontWeight: '900',
                color: '#B0A8C0',
                offsetY: -10
              },
              value: {
                show: true,
                fontSize: '20px',
                fontWeight: '900',
                color: '#FFFFFF',
                offsetY: 10,
                formatter: (val: string) => `$ ${parseInt(val).toLocaleString()}`
              },
              total: {
                show: true,
                label: 'TOTAL',
                color: '#B0A8C0',
                formatter: (w: any) => {
                  return `$ ${w.globals.seriesTotals.reduce((a: any, b: any) => a + b, 0).toLocaleString()}`;
                }
              }
            }
          }
        }
      }
    };
  }

  private updateChart() {
    if (!this.data || this.data.length === 0) {
      this.chartOptions.series = [];
      this.chartOptions.labels = [];
      this.chartOptions.colors = [];
      return;
    }

    this.chartOptions.series = this.data.map(d => d.amount);
    this.chartOptions.labels = this.data.map(d => d.name);
    this.chartOptions.colors = this.data.map(d => d.color);
  }
}
