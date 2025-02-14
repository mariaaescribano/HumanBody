'use client'

// Chakra imports
import { Card } from '@chakra-ui/react';

// Definir un tipo más preciso para las propiedades
interface CardProps {
  hijo: React.ReactNode; // Permite cualquier tipo de contenido JSX
  bgColor?: string;      // Propiedad opcional para color de fondo
  borderRadius?: string; // Border-radius opcional
}

export default function CustomCard({
  hijo,
  bgColor = "white",     // Valor por defecto para el color de fondo
  borderRadius = "20px", // Border-radius por defecto
}: CardProps) {

  return (
    <Card
      p={"40px"} 
      width={{ base: "80%", md: "100%" }} 
      mb={{ base: "20px", md: "10px" }} 
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
