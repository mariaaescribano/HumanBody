'use client';
import React, { useEffect, useState, useRef } from 'react';
import { alimentosSkeleton } from '../../../../../../backend/src/dto/alimentos.dto';
import VerAlimentoPage from '@/components/addfood/verAlimento/VerAlimentoPage';
import GreenSpinner from '@/components/global/random/GreenSpinner';

export default function VerAlimentoNutritionist() 
{
  const [alimento, setalimento ] = useState<alimentosSkeleton | null>(null);
  const [nutriId, setNutriId] = useState<string | null>(null);

  useEffect(() => {
    setNutriId(sessionStorage.getItem("nutriId"));
    
  }, []);

  return (
    <>
      {nutriId && <div style={{ display: alimento == null ? 'none' : "block" }}>
        <VerAlimentoPage alimento={alimento} setalimento={setalimento} nutri={nutriId}  />
      </div>} 
      {alimento == null && <GreenSpinner />}
    </>
  );
}