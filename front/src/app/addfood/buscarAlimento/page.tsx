'use client';
import React, { useEffect, useState, useRef } from 'react';
import ShowBuscarFoodPage from '@/components/addfood/buscarAlimento/ShowBuscarFoodPage';
import { miniCartaAlimento } from '../../../../../backend/src/dto/alimentos.dto';
import PurpleSpinner from '@/components/global/random/PurpleSpinner';

export default function BuscarFood() 
{
  const [cargado, setcargado] = useState<boolean>(false); // cargar todo el componente 
  return (
    <>
      <div style={{ display: cargado == false ? 'none' : "block" }}>
        <ShowBuscarFoodPage cargado={cargado} setcargado={setcargado} verMisCreaciones={false} />
      </div>
      {cargado == false && <PurpleSpinner />}
    </>
  );
}