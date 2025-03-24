'use client';
import { Box, HStack, Text, useColorModeValue } from '@chakra-ui/react';
import {
    buildStyles,
    CircularProgressbarWithChildren,
  } from 'react-circular-progressbar';
  import 'react-circular-progressbar/dist/styles.css'; // ¡No olvides importar los estilos!
import { CaloryIcon } from '../icons/CaloryIcon';
import { colorNutricionist } from '@/GlobalHelper';
  

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

export function CircProgressMini(props: {  
  nutriPantalla?: boolean; 
  caloriesPorAhora: number; 
  caloriesObjetivo: number; 
  percentage: number 
}) {
  let textColor = useColorModeValue('secondaryGray.900', 'white');

  // Determinar colores según nutriPantalla
  const isNutriPantalla = props.nutriPantalla !== null && props.nutriPantalla !== undefined;

  const stylesColorMode = useColorModeValue(
      {
          rotation: 0.25,
          textSize: '0px',
          textColor: 'transparent',
          pathTransitionDuration: 0.5,
          pathColor: isNutriPantalla ? colorNutricionist : '#E6D1F2', // Verde claro si nutriPantalla está presente
          trailColor: '#efe5e5', // Fondo verde claro si nutriPantalla está presente
          backgroundColor: 'transparent',
      },
      {
          rotation: 0.25,
          textSize: '0px',
          textColor: 'transparent',
          pathTransitionDuration: 0.5,
          pathColor: isNutriPantalla ? colorNutricionist : '#E6D1F2', // Verde claro si nutriPantalla está presente
          trailColor: '#efe5e5',  
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
  
  
