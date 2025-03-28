'use client'

// Chakra imports
import { Card } from '@chakra-ui/react';

// Definir un tipo más preciso para las propiedades
interface CardProps {
  hijo: React.ReactNode; // Permite cualquier tipo de contenido JSX
  bgColor?: string;      // Propiedad opcional para color de fondo
  borderRadius?: string; // Border-radius opcional
  minHeight?: string;
  mb?: string;
  mt?: string;
  p?: string;
  height?: string;
  overflowY?: any;
}

export default function CustomCard({
  hijo,
  bgColor = "white",     // Valor por defecto para el color de fondo
  borderRadius = "20px", // Border-radius por defecto
  minHeight = "auto",
  mb="10px",
  mt="20px",
  p="40px",
  height="auto",
  overflowY="none"
}: CardProps) {

  return (
    <Card
      p={p} 
      overflowY={overflowY}
      width={{ base: "90%", md: "100%" }} 
      mb={mb} 
      height={height} 
      minHeight={minHeight} 
      maxWidth="800px" 
      mt={mt} 
      align="center" 
      justify="center" 
      borderRadius={borderRadius}
      bg={bgColor} // Color de fondo opcional
    >
      {hijo}
    </Card>
  );
}
