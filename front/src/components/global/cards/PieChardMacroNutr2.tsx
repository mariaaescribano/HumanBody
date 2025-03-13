'use client';
import dynamic from 'next/dynamic';
import { Box, Flex, Text } from '@chakra-ui/react';
import { ArrayIsNullEmpty, colorCarbs, colorFats, colorFibra, colorProte } from '../../../GlobalHelper';
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

export const PieChardMacroNutr2 = (props: { pieChartData: number[], calories: string }) => {
  // Redondear los porcentajes
  const roundedData = props.pieChartData.map((item) => Math.round(item));

  // Asegurar que los porcentajes sumen exactamente 100 (en caso de que el redondeo cause un desajuste)
  const sum = roundedData.reduce((acc, curr) => acc + curr, 0);
  if (sum !== 100) {
    const diff = 100 - sum;
    roundedData[0] += diff; // Ajustar el primer elemento para que la suma sea 100
  }

  return (
    <Box position="relative" width="100%" height="100%">
      {/* Gráfico */}
      <Chart
        options={pieChartOptions}
        type="pie"
        width="100%"
        height="100%"
        series={ArrayIsNullEmpty(roundedData) ? pieChartDataDefault : roundedData}
      />

      <Flex
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        width="100%"
        maxWidth={"150px"}
        textAlign="center"
        fontWeight="bold"
        fontSize="14px"
        borderRadius="md"
        bg="white"
        boxShadow="10px 10px 10px rgba(0, 0, 0, 0.1)"
        justifyContent="center"  // Centra horizontalmente
        alignItems="center"       // Centra verticalmente
      >
        {/* Si se pasa un valor JSX (por ejemplo, un ícono y texto), se renderiza */}
        <Box p="5px" display="flex" alignItems="center">
          <CaloryIcon />
          <Text ml="10px" mr="10px">{!props.calories ? "0 kcal" : props.calories + " kcal"}</Text>
        </Box>
      </Flex>
    </Box>
  );
};

