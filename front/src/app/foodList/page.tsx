'use client';
import React, { useEffect, useState, useRef } from 'react';
import GreenSpinner from '@/components/global/random/GreenSpinner';
import FoodListContent from '@/components/foodList/FoodListContent';
import { alimentosComidosSkeleton } from '../../../../backend/src/dto/alimentos.dto';
import PurpleSpinner from '@/components/global/random/PurpleSpinner';


export default function FoodList() 
{
  const [alimentos, setalimentos ] = useState<alimentosComidosSkeleton[] | null >(null);

  return (
    <>
      {<FoodListContent alimentos={alimentos} setalimentos={setalimentos}></FoodListContent>}
      {!alimentos && <PurpleSpinner></PurpleSpinner>}
    </>);

}
