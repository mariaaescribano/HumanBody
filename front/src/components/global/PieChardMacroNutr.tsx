'use client';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { ArrayIsNull } from '../../../GlobalHelper';
// import Chart from 'react-apexcharts';
const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

 const pieChartOptions = {
  labels: ['Proteins', 'Fats', 'Carbs'],
  colors: ['white', '#abdefa', '#EDC9AF' ],
  chart: {
    width: '50px',
  },
  states: {
    hover: {
      filter: {
        type: 'none',
      },
    },
  },
  legend: {
    show: false,
  },
  dataLabels: {
    enabled: false,
  },
  // hover: { mode: null },
  plotOptions: {
    donut: {
      expandOnClick: false,
      donut: {
        labels: {
          show: false,
        },
      },
    },
  },
  fill: {
    colors: ['#610C04', '#abdefa', '#EDC9AF' ],
  },
  tooltip: {
    enabled: true,
    theme: 'dark',
  },
};

 const pieChartDataDefault = [36, 25, 12];


 export const PieChardMacroNutr = (props:{pieChartData:number[]}) => {

  return (
    // @ts-ignore
    <Chart
      options={pieChartOptions}
      type="pie"
      width="100%"
      height="100%"
      series={ArrayIsNull(props.pieChartData) ? pieChartDataDefault : props.pieChartData}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    />
  );
};

