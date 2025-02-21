'use client'

// Chakra imports
import { Card } from '@chakra-ui/react';

// Definir un tipo más preciso para las propiedades
interface CardProps {
  hijo: React.ReactNode; // Permite cualquier tipo de contenido JSX
  bgColor?: string;      // Propiedad opcional para color de fondo
  borderRadius?: string; // Border-radius opcional
  mb?: string;
}

export default function CustomCard({
  hijo,
  bgColor = "white",     // Valor por defecto para el color de fondo
  borderRadius = "20px", // Border-radius por defecto
  mb="10px"
}: CardProps) {

  return (
    <Card
      p={"40px"} 
      width={{ base: "90%", md: "100%" }} 
      mb={mb} 
      height="auto"
      maxWidth="800px" 
      mt="20px" 
      align="center" 
      justify="center" 
      borderRadius={borderRadius}
      bg={bgColor} // Color de fondo opcional
    >
      {hijo}
    </Card>
  );
}
