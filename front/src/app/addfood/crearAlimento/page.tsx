'use client';
import React, { useEffect, useState, useRef } from 'react';
import PurpleSpinner from '@/components/global/random/PurpleSpinner';
import CrearAlimentoPage from '@/components/addfood/crearAlimento/CrearAlimentoPage';

export default function CrearAlimentoUser() 
{
  const [screenSize, setscreenSize ] = useState<string>(""); 
  return (
    <>
      <div style={{ display: screenSize == "" ? 'none' : "block" }}>
        <CrearAlimentoPage screenSize={screenSize} setscreenSize={setscreenSize} />
      </div>
      {screenSize == "" && <PurpleSpinner />}
    </>
  );
}