// 'use client';
// import dynamic from 'next/dynamic';
// import { useEffect } from 'react';
// import { ArrayIsNull, colorCarbs, colorFats, colorFibra, colorProte } from '../../../GlobalHelper';
// // import Chart from 'react-apexcharts';
// const Chart = dynamic(() => import('react-apexcharts'), {
//   ssr: false,
// });

//  const pieChartOptions = {
//   labels: ['Proteins', 'Fats', 'Carbs', 'Fiber'],
//   colors: ['white', colorFats, colorCarbs, colorFibra ],
//   chart: {
//     width: '50px',
//   },
//   states: {
//     hover: {
//       filter: {
//         type: 'none',
//       },
//     },
//   },
//   legend: {
//     show: false,
//   },
//   dataLabels: {
//     enabled: false,
//   },
//   // hover: { mode: null },
//   plotOptions: {
//     donut: {
//       expandOnClick: false,
//       donut: {
//         labels: {
//           show: false,
//         },
//       },
//     },
//   },
//   fill: {
//     colors: [colorProte, colorFats, colorCarbs, colorFibra],
//   },
//   tooltip: {
//     enabled: true,
//     theme: 'dark',
//   },
// };

//  const pieChartDataDefault = [36, 25, 12, 5];


//  export const PieChardMacroNutr = (props:{pieChartData:number[]}) => {

//   return (
//     // @ts-ignore
//     <Chart
//       options={pieChartOptions}
//       type="pie"
//       width="100%"
//       height="100%"
//       series={ArrayIsNull(props.pieChartData) ? pieChartDataDefault : props.pieChartData}
//       style={{
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//       }}
//     />
//   );
// };


'use client';
import dynamic from 'next/dynamic';
import { ArrayIsNullEmpty, colorCarbs, colorFats, colorFibra, colorProte } from '../../../GlobalHelper';

const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

const pieChartOptions = {
  labels: ['Proteins', 'Fats', 'Carbs', 'Fiber'],
  colors: ['white', colorFats, colorCarbs, colorFibra],
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
    colors: [colorProte, colorFats, colorCarbs, colorFibra],
  },
  tooltip: {
    enabled: true,
    theme: 'dark',
  },
};

const pieChartDataDefault = [36, 25, 12, 5];

export const PieChardMacroNutr = (props: { pieChartData: number[] }) => {
  // Redondear los datos de los porcentajes
  const roundedData = props.pieChartData.map((item) => Math.round(item));

  // Asegurar que los porcentajes sumen exactamente 100 (en caso de que el redondeo cause un desajuste)
  // const sum = roundedData.reduce((acc, curr) => acc + curr, 0);
  // if (sum !== 100) {
  //   const diff = 100 - sum;
  //   roundedData[0] += diff; // Ajustar el primer elemento para que la suma sea 100
  // }

  return (
    // @ts-ignore
    <Chart
      options={pieChartOptions}
      type="pie"
      width="100%"
      height="100%"
      series={ArrayIsNullEmpty(roundedData) ? pieChartDataDefault : roundedData}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    />
  );
};

