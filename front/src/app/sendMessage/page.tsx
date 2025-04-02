'use client';
import React, { useEffect, useState, useRef } from 'react';
import PurpleSpinner from '@/components/global/random/PurpleSpinner';
import SendMessagePage from '@/components/sendMessage/SendMessagePage';

export default function SendMessageFromUser() 
{
  const [cargado, setcargado] = useState<boolean>(true); // cargar todo el componente 

  return (
    <>
      <div style={{ display: cargado == false ? 'none' : "block" }}>
        <SendMessagePage 
            idNutri={sessionStorage.getItem("userNutri")} userNom={sessionStorage.getItem("userNom")}
            nutri={false} diaId={sessionStorage.getItem("diaId")}
            cargado={cargado} setcargado={setcargado} // must be spinner until all the messages are on the screen
        />
      </div>
      {cargado == false && <PurpleSpinner />}
    </>
  );
}