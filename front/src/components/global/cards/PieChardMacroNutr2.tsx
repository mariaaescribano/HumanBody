'use client';
import dynamic from 'next/dynamic';
import { Box, Flex, Input , Text} from '@chakra-ui/react';
import { ArrayIsNull, colorCarbs, colorFats, colorFibra, colorProte } from '../../../../GlobalHelper';
import { CaloryIcon } from '@/components/icons/CaloryIcon';

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

export const PieChardMacroNutr2 = (props: { pieChartData: number[], calories:string }) => {
  return (
    <Box position="relative" display="flex" justifyContent="center" alignItems="center" width="100%" height="100%">
      {/* Gráfico */}
      <Chart
        options={pieChartOptions}
        type="pie"
        width="100%"
        height="100%"
        series={ArrayIsNull(props.pieChartData) ? pieChartDataDefault : props.pieChartData}
      />

     <Flex
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        width="100px"
        textAlign="center"
        fontWeight="bold"
        fontSize="14px"
        borderRadius="md"
        bg="white"
      >
        {/* If value is passed as JSX (e.g., icon and text), render it */}
        {<Box p="5px" display="flex" alignItems="center">
          <CaloryIcon />
          <Text ml="10px" mr="10px">{!props.calories ? "0 kcal" : props.calories + " kcal"}</Text>
        </Box>
        }
      </Flex>

    </Box>
  );
};
