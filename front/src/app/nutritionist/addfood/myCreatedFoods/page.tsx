'use client';
import React, { useEffect, useState, useRef } from 'react';
import ShowBuscarFoodPage from '@/components/addfood/buscarAlimento/ShowBuscarFoodPage';
import GreenSpinner from '@/components/global/random/GreenSpinner';

export default function MyCreatedFoodsNutri() 
{
  const [cargado, setcargado] = useState<boolean>(false); // cargar todo el componente 
  return (
    <>
      <div style={{ display: cargado == false ? 'none' : "block" }}>
        <ShowBuscarFoodPage cargado={cargado} setcargado={setcargado} verMisCreaciones={true} />
      </div>
      {cargado == false && <GreenSpinner />}
    </>
  );
}