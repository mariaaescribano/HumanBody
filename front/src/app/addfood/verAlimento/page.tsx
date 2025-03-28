'use client';
import React, { useEffect, useState, useRef } from 'react';
import ShowBuscarFoodPage from '@/components/addfood/buscarAlimento/ShowBuscarFoodPage';
import { alimentosSkeleton, miniCartaAlimento } from '../../../../../backend/src/dto/alimentos.dto';
import PurpleSpinner from '@/components/global/random/PurpleSpinner';
import VerAlimentoPage from '@/components/addfood/verAlimento/VerAlimentoPage';

export default function VerAlimento() 
{
  const [alimento, setalimento ] = useState<alimentosSkeleton | null>(null);
  return (
    <>
      <div style={{ display: alimento == null ? 'none' : "block" }}>
        <VerAlimentoPage alimento={alimento} setalimento={setalimento} nutri={"-1"}/>
      </div>
      {alimento == null && <PurpleSpinner />}
    </>
  );
}