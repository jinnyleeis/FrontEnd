'use client';

import LabeledInput from '@components/input-data2/labeled-input';
import InfoLayout from '@components/input-data2/info-layout';
import NutrientInfoLayout from '@components/input-data2/nutrient-info-layout';
import NutrientInputFieldsContainer from '@components/input-data2/nutrient-input-container';

interface Nutrient {
  name: string;
  unit: string;
  isRequired: boolean;
}

interface NutrientSection {
  nutrients: Nutrient[];
}

const nutrientSections: NutrientSection[] = [
  {
    nutrients: [
      { name: '간식 총량', unit: 'g', isRequired: true },
      { name: '칼로리', unit: 'kcal', isRequired: true },
      { name: '지방 (오메가3, 오메가6)', unit: '%', isRequired: true },
      { name: '단백질', unit: '%', isRequired: true },
      { name: '탄수화물', unit: '%', isRequired: false },
    ]
  },
  {
    nutrients: [
      { name: '칼슘', unit: '%', isRequired: false },
      { name: '인', unit: '%', isRequired: false },
    ]
  },
  {
    nutrients: [
      { name: '비타민 A', unit: '%', isRequired: false },
      { name: '비타민 D', unit: '%', isRequired: false},
      { name: '비타민 E', unit: '%', isRequired: false },

    ]
  }
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const title = '영양정보';
  const description = `영양 정보는 영양 분석을 위해 사용돼요.
입력하지 않은 영양 정보는 0으로 자동 입력돼요`;

  return (
    <>
      <InfoLayout
        title="포장 간식 정보를 적어주세요"
        description="주 사료, 생식, 날 것의 간식을 제외한, 스틱, 덴탈껌 등을 포함한 간식을 의미해요."
      />
      <LabeledInput label="포장 간식 이름" placeholder="포장 간식 이름을 적어주세요" />
      <NutrientInfoLayout title={title} description={description} />
      <NutrientInputFieldsContainer nutrientSections={nutrientSections} />
    </>
  );
}