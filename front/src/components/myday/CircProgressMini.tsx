'use client';
import { Box, HStack, Text, useColorModeValue } from '@chakra-ui/react';
import {
    buildStyles,
    CircularProgressbarWithChildren,
  } from 'react-circular-progressbar';
  import 'react-circular-progressbar/dist/styles.css'; // ¡No olvides importar los estilos!
import { CaloryIcon } from '../icons/CaloryIcon';
  

// export default function CircProgress(props: {
//   title: string;
//   percentage: number;
// }) {
//   const { title, percentage } = props;
//   let textColor = useColorModeValue('secondaryGray.900', 'white');

//   let stylesColorMode = useColorModeValue(
//     {
//       rotation: 0.25,
//       textSize: '0px',
//       textColor: 'transparent',
//       pathTransitionDuration: 0.5,
//       pathColor: 'var(--chakra-colors-brand-500)',
//       trailColor: 'purple.100',
//       backgroundColor: 'purple.100',
//     },
//     {
//       rotation: 0.25,
//       textSize: '0px',
//       pathTransitionDuration: 0.5,
//       pathColor: 'purple.100',
//       textColor: 'transparent',
//       trailColor: 'purple.100',
//     },
//   );
//   return (
//     <CircularProgressbarWithChildren
//       value={percentage}
//       text={`${percentage}%`}
//       styles={buildStyles(stylesColorMode)}
//     >
//       <Box>
//         <Text fontSize="sm" color="secondaryGray.600" fontWeight="500">
//           {title}
//         </Text>
//         <Text
//           fontSize="xl"
//           textAlign="center"
//           color={textColor}
//           fontWeight="700"
//         >
//           {percentage}%
//         </Text>
//       </Box>
//     </CircularProgressbarWithChildren>
//   );
// }

export function CircProgressMini(props: {  caloriesPorAhora:number; caloriesObjetivo:number; percentage:number }) {
    let textColor = useColorModeValue('secondaryGray.900', 'white');
  
    // Usando valores hexadecimales directamente para pathColor
    const stylesColorMode = useColorModeValue(
      {
        rotation: 0.25,
        textSize: '0px',
        textColor: 'transparent',
        pathTransitionDuration: 0.5,
        pathColor: '#E6D1F2',
        trailColor: '#efe5e5', // Color de fondo claro
        backgroundColor: 'transparent',
      },
      {
        rotation: 0.25,
        textSize: '0px',
        pathTransitionDuration: 0.5,
        pathColor: '#E6D1F2', // También morado para el modo oscuro
        textColor: 'transparent',
        trailColor: '#efe5e5', // Fondo más oscuro para modo oscuro
      }
    );
  
    return (
      <CircularProgressbarWithChildren
        value={props.percentage}
        text={"dee"}
        styles={buildStyles(stylesColorMode)}
      >
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
          <HStack>
            <CaloryIcon />
            <Text fontSize="10px" color={textColor} fontWeight="700">
              CALORIES
            </Text> 
          </HStack>
          
          <Text fontSize="45px" color={textColor} fontWeight="700">
            {props.caloriesPorAhora}
          </Text>
          <Text fontSize="md" color={textColor} fontWeight="700">
            / {props.caloriesObjetivo}
          </Text>
        </Box>
      </CircularProgressbarWithChildren>
    );
  }
  
  
