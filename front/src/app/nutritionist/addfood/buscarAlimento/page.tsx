'use client';
import React, { useEffect, useState, useRef } from 'react';
import ShowBuscarFoodPage from '@/components/addfood/buscarAlimento/ShowBuscarFoodPage';
import GreenSpinner from '@/components/global/random/GreenSpinner';

export default function NutritionistBuscarFood() 
{
  const [cargado, setcargado] = useState<boolean>(false); // cargar todo el componente 
  return (
    <>
      <div style={{ display: cargado == false ? 'none' : "block" }}>
        <ShowBuscarFoodPage cargado={cargado} setcargado={setcargado} verMisCreaciones={false} />
      </div>
      {cargado == false && <GreenSpinner />}
    </>
  );
}