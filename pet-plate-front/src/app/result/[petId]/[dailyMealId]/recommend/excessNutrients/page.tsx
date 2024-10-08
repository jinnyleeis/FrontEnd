'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import dailyMealsAPI from '@api/dailyMealsAPI';
import RightArrow from '@components/result/right-arrow';
import { nutrientExcessInfo } from '@lib/descriptionData';
import Wrapper from '@style/input-data2/Wrapper';
import Image from 'next/image';
import alertGraphic from '@public/svg/alert-graphic.svg?url';
import { usePathname } from 'next/navigation';


interface ResultProps {
  params: { petId: number; dailyMealId: number };
}

interface ExcessNutrient {
  name: string;
  unit: string;
  description: string;
  amount: number;
  properAmount: number;
  maximumAmount: number;
  maximumAmountRatioPerProperAmount: number;
  amountRatioPerProperAmount: number;
  amountRatioPerMaximumAmount: number;
}

export default function ExcessNutrientsPage({ params }: ResultProps) {
  const [petId, setPetId] = useState<number | null>(null);
  const [dailyMealId, setDailyMealId] = useState<number | null>(null);
  const [excessNutrients, setExcessNutrients] = useState<ExcessNutrient[]>([]);
  const pathname = usePathname();
  const [petName, setPetName] = useState<string | null>(null);


  const getPetInfoFromLocalStorage = () => {
    if (typeof window === 'undefined') return null;
    const petInfoString = localStorage.getItem('petInfo');
    if (!petInfoString) {
      console.error('No petInfo');
      return null;
    }
    try {
      const petInfo = JSON.parse(petInfoString);
      return petInfo;
    } catch (error) {
      console.error('', error);
      return null;
    }
  };


  useEffect(() => {
    const { petId, dailyMealId } = params;

    const petInfo = getPetInfoFromLocalStorage();
    if (petInfo) {
      console.log('petInfo:', petInfo);
    }
    setPetName(petInfo?.name);


    setPetId(petId);
    setDailyMealId(dailyMealId);

    if (petId && dailyMealId) {
      fetchExcessNutrients(petId, dailyMealId);
    }
  }, [params]);

  const fetchExcessNutrients = async (petId: number, dailyMealId: number) => {
    try {
      const response = await dailyMealsAPI.getExcessNutrients(petId, dailyMealId);
      setExcessNutrients(response.data.data);
    } catch (error) {
      console.error('과잉 영양소 불러오기 오류', error);
    }
  };

  const filteredNutrientExcessInfo = nutrientExcessInfo.filter((info) =>
    excessNutrients.some((nutrient) => nutrient.name === info.nutrientName),
  );

  return (
    <>
      <Wrapper>
        {filteredNutrientExcessInfo.length === 0 ? (
          <ImageWrapper>
            <EmptyText1>부족하거나 과한 영양소가 없어요!</EmptyText1>
            <AlertGraphic src={alertGraphic} alt="alert-graphic" />
            <EmptyText2>
            {petName}의 영양 관리를 잘 하고 계시네요.
            <br />
            {petName}의 식단이 바뀌어 영양 상태가 궁금해지면,
            <br />
            언제든 펫플레이트로 돌아와 영양 분석을 해주세요!{' '}
            </EmptyText2>
          </ImageWrapper>
        ) : (
          <>
            <div>
              <Content>
                {filteredNutrientExcessInfo.map((group, index) => (
                  <NutrientInfoSection nutrient={group.nutrientName} index={index} key={group.nutrientName} />
                ))}
                <ContainerWrapper>
                <Text1>비슷한 고민을 가진 반려인들은 
                <br />
                 이런 점을 신경써요!
                  </Text1>
                  {getNutritionAdvice(excessNutrients.map((n) => n.name)).map((advice, index) => (
                    <Card key={index}>
                      <Info>
                        <Vendor>{advice.title}</Vendor>
                        <Name>{advice.content}</Name>
                      </Info>
                    </Card>
                  ))}
                </ContainerWrapper>
              </Content>
            </div>
          </>
        )}
      </Wrapper>
    </>
  );
}

//alert text
const EmptyText1 = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 160%;
  color: ${(props) => props.theme.colors['grey10']};
  margin-bottom: 32px;
  text-align: center;
`;

const EmptyText2 = styled.div`
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 160%;
  color: ${(props) => props.theme.colors['grey9']};
  text-align: center;
  margin-top: 240px;
`;

const AlertGraphic = styled(Image)`
  margin-left: 45px;
  position: absolute;
`;

const ImageWrapper = styled.div`
  width: 300px;
  height: 230px;
  position: absolute;
  top: 247px;
  left: 30px;
`;

//-----//

const Content = styled.div`
  overflow-y: scroll;
  position: absolute;
  top: 150px;
  height: 650px;
  width: 360px;
`;
const getNutritionAdvice = (excessNutrients: string[]) => {
  // 영양소에 따른 조사 설정
  const nutrientParticleMap: { [key: string]: string } = {
    '탄수화물': '이',
    '단백질': '이',
    '지방': '이',
    '칼슘': '이',
    '인': '이',
    '비타민 A': '가',
    '비타민 D': '가',
    '비타민 E': '가'
  };


  // 배열에서 마지막 영양소 가져오기
  const lastNutrient = excessNutrients[excessNutrients.length - 1];
  
  // 기본 조사 '이'로 설정, 영양소에 따라 변경
  const particle = nutrientParticleMap[lastNutrient] || '가';
  
  // 영양소 목록을 문자열로 변환하고, 조사 추가
  const nutrientsString = excessNutrients.join(', ');

  return [
    {
      title: '균형 잡힌 식단',
      content: `입력한 식단에서 어떤 식품이 ${nutrientsString}${particle} 많이 함유되어 있는지 확인해주세요 -> 식이 조절: 사료와 보충제의 영양 성분표를 확인하여 ${nutrientsString} 함량을 확인해보세요! ${nutrientsString} 과잉 섭취를 완화하기 위해, 반려견 사료의 영양 성분표 내 ${nutrientsString}의 적정 함유량을 확인한 후 제품을 구매해요. AAFCO(미국 사료 관리 협회)와 같은 인정된 기관의 영양 지침을 충족하면서도 ${nutrientsString}${particle} 많이 안 들어있는 사료로 변경하는 걸 추천드려요. 더불어, ${nutrientsString}${particle} 많이 포함된 자연식품을 주의해주세요!`,
    },
    {
      title: '정기적인 수의사 검진',
      content: '정기적인 수의사 검진으로 개의 건강을 모니터링하고 영양소 과잉 섭취의 초기 징후를 발견할 수 있어요!',
    },
    {
      title: '과도한 보충제 피하기',
      content: `현재 ${nutrientsString}${particle} 포함된 보충제를 사용하고 있다면, 수의사의 지침에 따라 제한하는 걸 추천드려요. 직접적으로 ${nutrientsString}${particle} 명시되어 있지 않아도 종합 비타민이라면 해당될 수도 있으니 신중하게 사용하세요.`,
    },
    {
      title: '체중과 건강 모니터링',
      content: '개의 체중과 배변 활동, 활동량 등 건강을 정기적으로 모니터링하고 필요에 따라 식단을 조정하는걸 추천드려요',
    },
  ];
};

const ContainerWrapper = styled.div`
  position: absolute;
  padding-top: 120px;
  min-height: 476px;
  min-width: 360px;
  width: 360px;
  display: flex;
  flex-direction: column;
  background: var(--50, #ecfaf2);
    margin-top: 20px;
      height: auto;


`;

const Container = styled.div`
  height: 440px;
  min-height: 420px;
  min-width: 360px;
  max-height: 440px;
  z-index: 1000;
  position: absolute;
  display: flex;
`;

const Card = styled.div`
  display: inline-flex;
  padding: 10px 11px;
  align-items: center;
  gap: 8px;
  border-radius: 8px;
  background: var(--white, #fff);
  box-shadow: 2px 2px 15px 0px rgba(64, 201, 127, 0.25);
  display: flex;
  align-items: center;
  width: 312px;
  padding: 16px;
  margin-bottom: 16px;
  margin-left: 24px;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
`;

const Vendor = styled.span`
  width: 171px;
  color: var(--grey11, #36393c);
  font-family: SUIT;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%;
`;

const Name = styled.span`
  color: var(--grey8, #7c8389);
  font-family: SUIT;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 160%;
`;

const EmptyMessage = styled.div`
  font-family: SUIT;
  font-size: 14px;
  font-weight: 400;
  position: absolute;
  top: 430px;
  left: 125px;
  color: var(--grey8, #7c8389);
`;

const Text1 = styled.div`
  color: var(--700, #26784c);
  font-family: SUIT variable;
  font-size: 20px;
  font-weight: 700;
  line-height: 160%;
  letter-spacing: -0.75px;
  position: absolute;
  z-index: 100;
  background: var(--50, #ecfaf2);
  color: var(--700, #26784c);
  padding: 0px 16px;
  left: 16px;
margin-top: -80px;`;


const Text2 = styled.div`
  color: var(--700, #26784c);
  font-family: SUIT;
  font-size: 20px;
  font-weight: 700;
  line-height: 160%;
  letter-spacing: -0.75px;
  position: relative;
  z-index: 100;
  background: var(--50, #ecfaf2);
  margin-top: 30px;
  color: var(--700, #26784c);
  padding: 0px 16px;
  width: 360px;
  margin-bottom: 20px;
  height: 40px;
`;

const getParticle = (nutrient: string) => {
  // 영양소에 따른 조사 설정
  const nutrientParticleMap: { [key: string]: string } = {
    '탄수화물': '이',
    '단백질': '이',
    '지방': '이',
    '칼슘': '이',
    '인': '이',
    '비타민 A': '가',
    '비타민 D': '가',
    '비타민 E': '가'
  };

  // 기본 조사 '이'로 설정, 영양소에 따라 변경
  return nutrientParticleMap[nutrient] || '이';
};

const getParticle2 = (nutrient: string) => {
  // 영양소에 따른 조사 설정
  const nutrientParticleMap: { [key: string]: string } = {
    '탄수화물': '이란?',
    '단백질': '이란?',
    '지방': '이란?',
    '칼슘': '이란?',
    '인': '이란?',
    '비타민 A': '란?',
    '비타민 D': '란?',
    '비타민 E': '란?'
  };

  // 기본 조사 '이'로 설정, 영양소에 따라 변경
  return nutrientParticleMap[nutrient] || '이란?';
};


const NutrientInfoSection = ({ nutrient, index }: { nutrient: any; index: number }) => {
  const nutrientData = nutrientExcessInfo.find((info) => info.nutrientName === nutrient);
  const particle = getParticle(nutrient); // 영양소에 따른 조사 결정
  const particle2 = getParticle2(nutrient); // 영양소에 따른 조사 결정2


  return (
    <Section>
      <OrderText>{`${orderArray[index].word}번째 과잉 영양소`}</OrderText>
      <NutrientTitle>{nutrientData?.title}</NutrientTitle>
      <NutrientContent>{nutrientData?.content}</NutrientContent>
      <NutrientSymptomsTitle><GreenText>{`${nutrient}`}</GreenText>{`${particle}`} 과잉 섭취될 때 발생할 수 있는 증상</NutrientSymptomsTitle>
      <SymptomsList>
        {nutrientData?.symptoms.map((symptom, i) => (
          <SymptomWrapper key={i}>
            <SymptomIcon src={symptom.src} alt="아이콘" />
            <SymptomItem key={i}>
              <SymptomName>{symptom.name}</SymptomName>
              <SymptomDescription>{symptom.description}</SymptomDescription>
            </SymptomItem>
          </SymptomWrapper>
        ))}
      </SymptomsList>
      <NutrientDefinitionTitle><GreenText>{`${nutrient}`}</GreenText>{`${particle2}`}</NutrientDefinitionTitle>
      <NutrientDefinition>{nutrientData?.definition}</NutrientDefinition>
    </Section>
  );
};

const GreenText = styled.span`
  color: var(--primary, #40c97f);
  font-weight: 700;
`;

const Section = styled.div`
  margin-bottom: 40px;
  margin-left: 25px;
  margin-top: 40px;
`;

const OrderText = styled.div`
  color: var(--grey7, #959ca4);
  font-family: SUIT;
  font-size: 12px;
  font-weight: 600;
  line-height: 160%;
  margin-bottom: 4px;
`;

const NutrientTitle = styled.div`
  color: var(--primary, #40c97f);
  font-family: SUIT variable;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%;
  letter-spacing: -0.75px;
`;

const NutrientContent = styled.div`
  color: var(--grey11, #36393c);
  width: 312px;
  font-family: SUIT;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 160%;
  margin-bottom: 16px;
`;

const NutrientSymptomsTitle = styled.div`
  color: var(--grey11, #36393c);
  font-family: SUIT variable;

  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  margin-bottom: 6px;
  line-height: 160%;
`;

const SymptomsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  width: 165px;
  color: var(--grey11, #36393c);
  font-family: SUIT;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 160%;
`;

const SymptomWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 14px;
`;

const SymptomItem = styled.li`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 256px;
`;

const SymptomIcon = styled(Image)`
  width: 36px;
  height: 36px;
  background-size: contain;
  margin-right: 15px;
`;


const SymptomName = styled.div`
  width: 165px;
  margin-right: 8px;
  color: var(--grey11, #36393c);
  font-family: SUIT middle;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 160%;
  margin-bottom: 0px;
`;

const SymptomDescription = styled.div`
  color: var(--grey11, #36393c);
  font-family: SUIT;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 160%;
  width: 256px;
`;

const NutrientDefinitionTitle = styled.div`
  color: var(--grey11, #36393c);
  font-family: SUIT variable;
  font-size: 16px;
  font-weight: 700;
  line-height: 160%;
  margin-bottom: 6px;
  margin-top: 25px;
`;

const NutrientDefinition = styled.div`
  color: var(--grey11, #36393c);
  font-family: SUIT;
  font-size: 14px;
  font-weight: 400;
  line-height: 160%;
  align-self: stretch;
  width: 312px;
`;

const orderArray = [
  { index: 1, word: '첫' },
  { index: 2, word: '두' },
  { index: 3, word: '세' },
  { index: 4, word: '네' },
  { index: 5, word: '다섯' },
  { index: 6, word: '여섯' },
  { index: 7, word: '일곱' },
  { index: 8, word: '여덟' },
  { index: 9, word: '아홉' },
  { index: 10, word: '열' },
];
