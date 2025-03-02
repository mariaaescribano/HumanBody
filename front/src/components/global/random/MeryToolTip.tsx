import React, { useState, useRef } from 'react';
import { Box, Text } from '@chakra-ui/react';

const MeryTooltip = (props: { texto: string }) => {
  const [isTextVisible, setIsTextVisible] = useState(false);
  const color = useRef<string>("#C7C7C7");

  const toggleTextVisibility = () => {
    if (isTextVisible == true) color.current = "#C7C7C7";
    else color.current = "black";
    setIsTextVisible(!isTextVisible);
  };

  return (
    <>
      {props.texto && (
        <Box ml="8px" onClick={toggleTextVisibility} cursor="pointer" position="relative">
          {/* Mostrar texto con posición absoluta */}
          {isTextVisible && (
            <Box position="absolute" zIndex="10" top="100%" whiteSpace={{sm: "wrap", md:"nowrap"}}  h="auto" left="0" mt="4px" bg="black" p="2px" borderRadius="4px">
              <Text color="white" fontSize="sm"  p="4px">
                {props.texto}
              </Text>
            </Box>
          )}
          {/* Ícono del Tooltip */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="15px"
            viewBox="0 -960 960 960"
            width="20px"
            fill={color.current}
          >
            <path d="M431.52-271.52h96.96V-520h-96.96v248.48ZM480-588.7q21.8 0 36.55-14.75Q531.3-618.2 531.3-640q0-21.8-14.75-36.55Q501.8-691.3 480-691.3q-21.8 0-36.55 14.75Q428.7-661.8 428.7-640q0 21.8 14.75 36.55Q458.2-588.7 480-588.7Zm0 527.92q-87.52 0-163.91-32.96-76.38-32.96-132.88-89.47-56.51-56.5-89.47-132.88Q60.78-392.48 60.78-480t32.96-163.91q32.96-76.38 89.47-132.88 56.5-56.51 132.88-89.47 76.39-32.96 163.91-32.96t163.91 32.96q76.38 32.96 132.88 89.47 56.51 56.5 89.47 132.88 32.96 76.39 32.96 163.91t-32.96 163.91q-32.96 76.38-89.47 132.88-56.5 56.51-132.88 89.47Q567.52-60.78 480-60.78Zm0-106q131.74 0 222.48-90.74 90.74-90.74 90.74-222.48t-90.74-222.48Q611.74-793.22 480-793.22t-222.48 90.74Q166.78-611.74 166.78-480t90.74 222.48q90.74 90.74 222.48 90.74ZM480-480Z" />
          </svg>
        </Box>
      )}
    </>
  );
};

export default MeryTooltip;
