'use client';
import React, { useEffect, useState, useRef } from 'react';
import PurpleSpinner from '@/components/global/random/PurpleSpinner';
import { designamealSkeleton } from '../../../../../backend/src/dto/meal.dto';
import LastPagePage from '@/components/designMeal/LastPagePage';

export default function LastPageUser() 
{
  // todos los meals pero con sus datos para show off
  const [meals, setmeals] = useState<designamealSkeleton[]>([]);
  return (
    <>
      <div style={{ display: meals.length == 0 ? 'none' : "block" }}>
        <LastPagePage meals={meals} setmeals={setmeals} soyNutri={"false"} />
      </div>
      {meals.length == 0 && <PurpleSpinner />}
    </>
  );
}