'use client';

import React from 'react';
import { Bar } from 'react-chartjs-2';
import styled from 'styled-components';

import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  Legend,
  Title,
  BarController,
} from 'chart.js';

ChartJS.register(LinearScale, CategoryScale, BarElement, PointElement, Legend, Title, BarController);

function NutrientBar({
  label,
  intake,
  recommended,
  color,
}: {
  label: string;
  intake: number;
  recommended: number;
  color: string;
}) {
  const maxNutrientValue = 100; // 비율로 나타나게끔
  const normalizedIntake = Math.min((intake / recommended) * maxNutrientValue, maxNutrientValue);

  const chartData = {
    labels: [label],
    datasets: [
      {
        label: '섭취 영양소',
        data: [normalizedIntake],
        backgroundColor: [color],
        borderRadius: 20,
        barPercentage: 1,
        borderSkipped: false,
        minBarLength: 10,
      },
    ],
  };

  const options = {
    barThickness: 7
,
    indexAxis: 'y' as 'y',
    scales: {
      x: {
        display: false, 
        grid: {
          display: false, 
        },
        max: maxNutrientValue,
      },
      y: {
        display: false, 
        grid: {
          display: false, 
        },
      },
    },
    plugins: {
      legend: {
        display: false, 
      },
      title: {
        display: false, 
      },
    },
    responsive: true,
  };

  return (
    <BarWrapper>
      <BarBackground />
      <NutrientNameText>
       {label}
      </NutrientNameText>
      <Bar data={chartData} options={options} />
      <NutrientText>
       {intake}g / {recommended}g
      </NutrientText>
    </BarWrapper>
  );
}

export default function LineChart() {

  // 실제
  const recommendedValues = { fat: 5.445, protein: 15.72, carbs: 45.5 };

//더미 
  const intakeData = {
    fat: 3.5,
    protein: 12.0,
    carbs: 45.5,
  };

  return (
    <LineWrapper>
      <NutrientBar label="지방" intake={intakeData.fat} recommended={recommendedValues.fat} color="#FF4D46" />
      <NutrientBar label="단백질" intake={intakeData.protein} recommended={recommendedValues.protein} color="#40C97F" />
      <NutrientBar label="탄수화물" intake={intakeData.carbs} recommended={recommendedValues.carbs} color="#40C97F" />
    </LineWrapper>
  );
}

const LineWrapper = styled.div`
  top: 370px;
  left: 230px;
  position: absolute;
  display: flex;
  flex-direction: column;
`;

const BarWrapper = styled.div`
  position: relative;
  width: 80px; 
  height: 40px; 
  margin-bottom: 12px;
  z-index: 20;
`;

const BarBackground = styled.div`
  background-color: #eceef0;
  border-radius: 20px;
  position: absolute;
  top: +16px;
  left: 0;
  width: 100%;
  height: 17%; 
  z-index: -1;
`;

const NutrientText = styled.div`
margin-top:-15px;
color: var(--grey8, #7C8389);

/* caption_regular_10pt */
font-family: SUIT;
font-size: 10px;
font-style: normal;
font-weight: 400;
line-height: 160%; /* 16px */

`;

const  NutrientNameText = styled.div`
position: absolute;


color: var(--grey11, #36393C);

/* caption_regular_10pt */
font-family: SUIT;
font-size: 10px;
font-style: normal;
font-weight: 400;
line-height: 160%; /* 16px */




`;