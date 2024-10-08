'use client';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import Link from 'next/link';
import ExitButtonSVG from '@public/svg/exit-button.svg?url';
import Image from 'next/image';
import ResultBox from '@public/svg/result-info-box.svg?url';
import FoodCardsContainer from '@components/input-data2/common/foodcards-container';
import { useRecoilState } from 'recoil';
import { dailyMealsState, nutrientDataState } from '@recoil/nutrientAtoms';
import { dailyMealsAPI } from '@api/dailyMealsAPI';
import { saveDailyMealsNutrients, fetchPetNutrientData } from '@lib/apiService';
import DoughnutChart from '@components/result/doughnut-chart';
import LineChart from '@components/result/line-chart';
import Wrapper from '@style/input-data2/Wrapper';
import { useEffect, useState } from 'react';

interface PetInfo {
  petId: number;
  name: string;
  age: number;
  weight: number;
  activity: string;
  neutering: string;
  profileImgPath: string | null;
}



const storeNutrientDataInLocalStorage = (petId: number, dailyMealId: number, nutrientData: any) => {
  const key = `${petId}-${dailyMealId}`;
  localStorage.setItem(key, JSON.stringify(nutrientData));
};

const storeAllNutrientDataInLocalStorage = (petId: number, dailyMealId: number, allNutrientData: any) => {
  const key = `selected-nutrient-${petId}-${dailyMealId}`;
  localStorage.setItem(key, JSON.stringify(allNutrientData));
};

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

const getSelectedDate = () => {
  if (typeof window === 'undefined') return null;
  const selectedDate = localStorage.getItem('selectedDate');
  if (!selectedDate) {
    console.error('');
    return getTodayDate();
  }
  return selectedDate;
};

const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const fetchdailyMealId = async (petId: number, date?: string) => {
  const response = await dailyMealsAPI.getPetDailyMeals(petId, date);
  return response.data;
};

const fetchdailyMealLists = async (petId: number, dailyMealId: number) => {
  const response = await dailyMealsAPI.getSpecificMeal(petId, dailyMealId);
  return response.data;
};

const getTodayDateDisplay = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return { year, month, day };
};

interface ResultProps {
  params: { petId: number; dailyMealId: number };
}

export default function Page({ params }: ResultProps) {
  const router = useRouter();
  const { petId, dailyMealId } = params;
  const [petInfo, setPetInfo] = useState<PetInfo | null>(null);
  const [deficientNutrients, setDeficientNutrients] = useState<string[]>([]);
  const [excessNutrients, setExcessNutrients] = useState<string[]>([]);
  const [nutrientsData, setNutrientsData] = useRecoilState(nutrientDataState);
  const [dailyMeals, setDailyMeals] = useRecoilState(dailyMealsState);
  const [mainNutrients, setMainNutrients] = useState<string[]>([]);
  const [activity, setActivity] = useState<string>('');

  const date = getSelectedDate() || '0';
  const [year, month, day] = date.split('-');

  const fetchNutrientData = async (date: string) => {
    try {
      const [excessNutrientsResponse, properNutrientsResponse, deficientNutrientsResponse] = await Promise.all([
        dailyMealsAPI.getExcessNutrients(petId, dailyMealId),
        dailyMealsAPI.getProperNutrients(petId, dailyMealId),
        dailyMealsAPI.getDeficientNutrients(petId, dailyMealId),
      ]);

      const { todayNutrients, todayKcal, todaykcalRatio, todayProperKcal } = await fetchPetNutrientData(petId, date);

      setDeficientNutrients(deficientNutrientsResponse.data.data.map((nutrient: any) => nutrient.name));
      setExcessNutrients(excessNutrientsResponse.data.data.map((nutrient: any) => nutrient.name));

      const nutrientData = {
        excessNutrients: excessNutrientsResponse.data.data.map((nutrient: any) => nutrient.name),
        properNutrients: properNutrientsResponse.data.data.map((nutrient: any) => nutrient.name),
        deficientNutrients: deficientNutrientsResponse.data.data.map((nutrient: any) => nutrient.name),
        todayNutrients: todayNutrients.data.data,
        todayKcal: todayKcal?.data.kcal,
        todaykcalRatio: todaykcalRatio.data.kcalRatio,
        todayProperKcal: todayProperKcal?.data.kcal,
      };

      setNutrientsData(nutrientData);
      storeNutrientDataInLocalStorage(petId, dailyMealId, nutrientData);

      const todayNutrientsData = todayNutrients.data;
      storeAllNutrientDataInLocalStorage(petId, dailyMealId, todayNutrientsData);
      setMainNutrients([todayNutrients.data[0], todayNutrients.data[1], , todayNutrients.data[2]]);
    } catch (error) {
      console.error('오류', error);
    }
  };

  const fetchDailyMeals = async () => {
    try {
      if (dailyMealId) {
        const dailyMealListsResponse = await fetchdailyMealLists(petId, dailyMealId);

        const filteredData = {
          ...dailyMealListsResponse.data,
          dailyRaws: dailyMealListsResponse.data.dailyRaws.filter(
            (item: any) => item.name !== '존재하지 않는 음식입니다',
          ),
          dailyFeeds: dailyMealListsResponse.data.dailyFeeds.filter(
            (item: any) => item.name !== '존재하지 않는 음식입니다',
          ),
          dailyPackagedSnacks: dailyMealListsResponse.data.dailyPackagedSnacks.filter(
            (item: any) => item.name !== '존재하지 않는 음식입니다',
          ),
          dailyBookMarkedRaws: dailyMealListsResponse.data.dailyBookMarkedRaws.filter(
            (item: any) => item.name !== '존재하지 않는 음식입니다',
          ),
          dailyBookMarkedFeeds: dailyMealListsResponse.data.dailyBookMarkedFeeds.filter(
            (item: any) => item.name !== '존재하지 않는 음식입니다',
          ),
          dailyBookMarkedPackagedSnacks: dailyMealListsResponse.data.dailyBookMarkedPackagedSnacks.filter(
            (item: any) => item.name !== '존재하지 않는 음식입니다',
          ),
        };

        setDailyMeals(filteredData);
      } else {
        console.log('추가 식단x');
      }
    } catch (e) {
      console.error(e); // 에러
    }
  };

  useEffect(() => {
    const initialize = async () => {
      await saveDailyMealsNutrients(petId);
      await fetchDailyMeals();
      await fetchNutrientData(date);
    };

    initialize();
  }, []);

  useEffect(() => {
    const petInfo = getPetInfoFromLocalStorage();
    setPetInfo(petInfo);

    switch (petInfo?.activity) {
      case 'VERY_ACTIVE':
        setActivity('초활발');
        break;
      case 'ACTIVE':
       setActivity('활발');
        break;
      case 'SOMEWHAT_ACTIVE':
        setActivity('보통');
        break;
      case 'INACTIVE':
       setActivity('차분');
        break;
      default:
       setActivity('활동량 정보 없음');
    }
  }, []);

  console.log(nutrientsData);

  const getNutritionAdvice = (nutrients: string[]) => {
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
  
    if (nutrients.length === 0) return '';
  
    // 배열에서 마지막 영양소 가져오기
    const lastNutrient = nutrients[nutrients.length - 1];
  console.log(lastNutrient);
    // 마지막 영양소에 따른 조사 결정
    const particle = nutrientParticleMap[lastNutrient] || '이';
  
    // 영양소 목록을 문자열로 변환하고, 조사 추가
    return `${nutrients.join(', ')}${particle}`;
  };

  return (
    <Wrapper>
      <Title>분석 결과</Title>
      <ExitButtonImage src={ExitButtonSVG} alt="exit-button" onClick={() => router.push('/main/analyze')} />
      <Container>
        <Content>
          <DateTitle>
            {' '}
            {year}. {month}. {day} 분석 결과
          </DateTitle>
          <SVGContent>
            <SVGImage src={ResultBox} width={312} height={169} alt="loading" />
            {(deficientNutrients.length > 0 && excessNutrients.length > 0) ? (
        <FirstLine>
        <RedText>{getNutritionAdvice(deficientNutrients)}</RedText> 부족해요!
      </FirstLine>
      ) : deficientNutrients.length > 0 ? (
      <FirstLine>
        <RedText>{getNutritionAdvice(deficientNutrients)}</RedText> 부족해요!
      </FirstLine>
      ) : excessNutrients.length > 0 ? (
      <FirstLine>
        <RedText>{getNutritionAdvice(excessNutrients)}</RedText> 과해요!
      </FirstLine>
      ) : (
      <FirstLine>부족하거나 과한 영양소가 없어요!</FirstLine>
            )}
            <SecondLine>
              몸무게 <BoldText>{petInfo?.weight}kg |</BoldText> 활동량 <BoldText>{activity}</BoldText>
            </SecondLine>
            
          </SVGContent>
          <StyledLink href={`/result/${petId}/${dailyMealId}/recommend/deficientNutrients`}>
            <RecommendationButton>추천 영양성분 보기</RecommendationButton>
          </StyledLink>
          <GraphContainer>
            <GraphText1>
              {nutrientsData.todayProperKcal - nutrientsData.todayKcal > 0 ? (
                <>
                  <GreenText>{Math.round(nutrientsData.todayProperKcal - nutrientsData.todayKcal)}kcal</GreenText> 더
                  먹어도 좋아요!
                </>
              ) : (
                <GreenText>칼로리가 적정 칼로리를 초과해요</GreenText>
              )}
            </GraphText1>
            <GraphText2>
            <BoldText><GreenText>{petInfo?.name}</GreenText></BoldText>의 하루 권장 섭취량은 <BoldText>{Math.round(nutrientsData.todayProperKcal)}</BoldText>
              kcal예요
            </GraphText2>
            <DoughnutChart todayKcal={nutrientsData.todayKcal} todayProperKcal={nutrientsData.todayProperKcal} />
            <Text1>
              {Math.round(nutrientsData.todayKcal)}/{Math.round(nutrientsData.todayProperKcal)}
            </Text1>
            <LineChart nutrientData={mainNutrients} />
          </GraphContainer>
          <StyledLink href={`/result/${petId}/${dailyMealId}/detail`}>
            <DetailButton>영양소 상세 보기</DetailButton>
          </StyledLink>
          <MealListTitle>
            <BoldText><GreenText>{petInfo?.name}</GreenText></BoldText>의 하루 식단
          </MealListTitle>
          <ContentContainer>
            {dailyMeals ? (
              <FoodCardsContainer dailyMeals={dailyMeals} />
            ) : (
              <EmptyMessage>식단을 불러오는 중이에요!</EmptyMessage>
            )}
          </ContentContainer>
        </Content>
      </Container>

      <EmptyBottom></EmptyBottom>
    </Wrapper>
  );
}

const GraphText1 = styled.div`
  color: var(--grey11, #36393c);
  font-family: SUIT middle;
  font-size: 20px;
  font-weight: 700;
  line-height: 160%;
  letter-spacing: -0.75px;
  margin-top:56px;


`;

const GraphText2 = styled.div`
  color: var(--grey11, #36393c);
  font-family: SUIT;
  font-size: 14px;
  font-weight: 400;
  line-height: 160%;
  margin-bottom: 20px;
`;

const RedText = styled.span`
  color: var(--symentic-red-400, #ff706b);
  font-weight: 600;
`;

const BoldText = styled.span`
  font-family: SUIT middle;
`;

const GreenText = styled.span`
  color: var(--primary, #40c97f);
  font-weight: 700;
`;

const WrapperStyleWrapper = styled.div`
  width: 360px;
  height: 800px;
  position: relative;
`;

const Container = styled.div`
  height: 704px;
  width: 360px;
  overflow-y: auto;
  position: absolute;
  max-height: 704px;
  max-width: 360px;
  top: 96px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-family: SUIT ;
  font-size: 18px;
  font-weight: 600;
  top: 44px;
  position: absolute;
  width: 360px;
  margin-bottom: 15px;
  left: 40%;
`;

const Content = styled.div`
  padding: 16px;
`;

const DateTitle = styled.div`
  color: var(--grey11, #36393c);
  font-family: SUIT middle;
  font-size: 16px;
  font-weight: 1000;
  line-height: 160%;
  margin-bottom: 8px;

`;

const FirstLine = styled.p`
  font-family: SUIT;
  font-size: 16px;
  font-weight: 400;
  line-height: 180%;
  letter-spacing: -0.75px;
  color: var(--grey11, #36393c);
  top: 16px;
  left: 18px;
`;

const SecondLine = styled.p`
  font-family: SUIT;
  font-size: 12px;
  font-weight: 400;
  line-height: 160%;
  color: var(--grey10, #4f5357);
  top: 48px;
  left: 18px;
`;

const RecommendationButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 224px;
  height: 48px;
  padding: 14px;
  margin-bottom: 56px;
  margin-top: 18px;
  margin: 16px auto;
  border-radius: 8px;
  border: none;
  background: var(--primary, #40c97f);
  color: white;
  cursor: pointer;
  font-family: SUIT;
  font-size: 16px;
  font-weight: 600;
  line-height: 160%;
  outline: none;
      
`;

const GraphContainer = styled.div`
  width: 100%;
  height: 270px;
  min-height: 290px;
  margin: 16px 0;
  background: var(--grey1, #fafafc);
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

const DetailButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 224px;
  height: 48px;
  padding: 14px;
  margin: -22px auto;
  border-radius: 8px;
  background: var(--grey1, #fafafc);
  color: white;
  cursor: pointer;
  font-family: SUIT;
  font-size: 14px;
  font-weight: 600;
  line-height: 160%;
  outline: none;
  border: none;
  color: var(--600, #33a165);
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  line-height: 160%;
  border-radius: 8px;
  border: 1px solid var(--600, #33a165);

`;

const MealListTitle = styled.h2`
  margin-top: 48px;
  height: 250px;
  color: var(--grey11, #36393c);
  font-family: SUIT;
  font-size: 18px;
  font-weight: 600;
  line-height: 160%;
  letter-spacing: -0.2px;
`;

const ExitButtonStyleWrapper = styled.div`
  position: absolute;
  z-index: 3000;
  right: 26px;
  cursor: pointer;
  top: 47px;
`;

function ExitButtonImage({ src, alt, onClick }: { src: string; alt: string; onClick: () => void }) {
  return (
    <ExitButtonStyleWrapper onClick={onClick}>
      <Image src={src} alt={alt} />
    </ExitButtonStyleWrapper>
  );
}

const SVGContent = styled.div`
  width: 312px;
  height: 169px;
  border-radius: 8px;
      display: flex;
      flex-direction: column;
  justify-content: flex-start;
  position: relative;
  z-index: 100;
  padding-top:16px;
  padding-left:17px;
    padding-right:14px;

`;

const SVGImage = styled(Image)`
  width: 312px;
  height: 169px;
  top: 0;
  left: 0;
  border-radius: 8px;
  position: absolute;
  z-index: -1;



`;

const ContentContainer = styled.div`
  margin-top: 20px;
  z-index: 10;
  top: 721px;
  left: 24px;
  height: 250px;
  max-height: 250px;
  width: 312px;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  position: absolute;
  margin-bottom: 10px;
`;

const EmptyMessage = styled.div`
  position: absolute;
  left: 28%;
  top: 160px;
  z-index: 10;
  color: var(--grey8, #7c8389);
  text-align: center;
  font-family: SUIT;
  font-size: 14px;
  font-weight: 400;
  line-height: 160%;
`;

const EmptyBottom = styled.div`
  position: absolute;
  z-index: 2000;
  bottom: 0px;
  height: 500px;
  max-height: 13px;
  width: 360px;
  background-color: ${(props) => props.theme.colors['grey1']};
`;

const Text1 = styled.div`
  color: var(--grey11, #36393c);
  text-align: center;
  position: absolute;
  top: 200px;
  font-family: SUIT Middle;
  font-size: 25px;
  font-weight: 700;
  line-height: 14.083px;
  letter-spacing: -1px;
  z-index: 100;
  width: 300px;
  margin-top: 290px;
  left: -35px;
`;
