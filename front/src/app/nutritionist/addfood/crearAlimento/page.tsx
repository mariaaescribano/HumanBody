'use client';
import React, { useEffect, useState, useRef } from 'react';
import PurpleSpinner from '@/components/global/random/PurpleSpinner';
import CrearAlimentoPage from '@/components/addfood/crearAlimento/CrearAlimentoPage';
import GreenSpinner from '@/components/global/random/GreenSpinner';

export default function CrearAlimentoNutritionist() 
{
  const [screenSize, setscreenSize ] = useState<string>(""); 
  return (
    <>
      <div style={{ display: screenSize == "" ? 'none' : "block" }}>
        <CrearAlimentoPage screenSize={screenSize} setscreenSize={setscreenSize} soyNutri={"true"}/>
      </div>
      {screenSize == "" && <GreenSpinner />}
    </>
  );
}