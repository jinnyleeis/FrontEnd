'use client';

import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import styled from 'styled-components';
import { useState, useEffect } from 'react';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DoughnutChart({ todayKcal, todayProperKcal }: { todayKcal: number; todayProperKcal: number }) {


  // 적정 칼로리가 총
  // 섭취한 칼로리
  // 남은 칼로리 적정 칼로리-섭취한 칼로리


  const remainTotalKcal= getRemainKcal(todayProperKcal, todayKcal);

  function getRemainKcal(proper:number, consumed:number) {
    if (proper - consumed > 0) {
      return proper - consumed;
      console.log(proper - consumed);
    } else if (proper - consumed < 0) {
      console.log(proper - consumed);
      return 0;
    }
  }

  const doughnutData = {
    datasets: [
      {
        label: '적정 섭취 칼로리',
        data: [todayKcal, remainTotalKcal],
        backgroundColor: ['#40C97F', '#ECEEF0'],
        hoverOffset: 4,
        borderWidth: 0,
        circumference: 300,
        rotation: 210,
        cutout: 72,
        borderRadius: 8,
      },
    ],
  };

  return (
    <>
   
    <DoughnutWrapper>
     
      <Doughnut data={doughnutData}></Doughnut>

      <Text1>
      
      </Text1>
      <Text2>kcal</Text2>
    </DoughnutWrapper>
    </>
  );
}

const Text1 = styled.div`
  color: var(--grey11, #36393c);
  text-align: center;
  position: absolute;
  top: 200px;
  /* display_bold_25pt */
  font-family: SUIT Middle;
  font-size: 25px;
  font-style: normal;
  font-weight: 700;
  line-height: 14.083px; /* 56.332% */
  letter-spacing: -1px;
  z-index: 100;
  width: 300px;
  margin-top: -115px;
  left: -60px;
`;

const Text2 = styled.div`
  color: var(--grey11, #36393c);
  text-align: center;
  position: absolute;
  top: 200px;
  /* display_bold_25pt */
    font-family: SUIT Middle;
  font-size: 25px;
  font-style: normal;
  font-weight: 700;
  line-height: 14.083px; /* 56.332% */
  letter-spacing: -1px;
  z-index: 100;
  width: 300px;
  margin-top: -90px;
  left: -60px;
`;

const DoughnutWrapper = styled.div`
  position: relative;
  width: 180px;
  hieght: 180px;
`;
