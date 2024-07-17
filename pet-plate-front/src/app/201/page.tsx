'use client';

import { dailyMealsAPI } from '@api/dailyMealsAPI';
import FoodCardsContainer from '@components/input-data2/common/foodcards-container';
import AddButton from '@components/input-data2/common/addplate-button';
import id_200 from '@public/svg/id_200.svg?url';
import Image from 'next/image';
import StoreButtonInactive from '@public/svg/btn_cta_inactive.svg?url';
import StoreButtonActive from '@public/svg/btn_cta_active.svg?url';
import styled from 'styled-components';
import Wrapper from '@style/input-data2/Wrapper';
import Notice from '@components/input-data2/common/notice';
import { isCompleteValid } from '@recoil/atoms';
import { useRecoilValue, useSetRecoilState, useRecoilState } from 'recoil';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

import { noticeState, isCompleteModalOpenState } from '@recoil/atoms';

const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1 필요
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

function isConpleteValid(dailyMealList: any) {
  return (
    dailyMealList.dailyRaws.length +
      dailyMealList.dailyFeeds.length +
      dailyMealList.dailyPackagedSnacks.length +
      dailyMealList.dailyBookMarkedRaws.length +
      dailyMealList.dailyBookMarkedFeeds.length +
      dailyMealList.dailyBookMarkedPackagedSnacks.length >
    0
  );
}

const fetchdailyMealId = async (petId: number, date?: string) => {
  const response = await dailyMealsAPI.getPetDailyMeals(petId, date);
  console.log('fetchdailyMealId response:', response);
  return response.data;
};

const fetchdailyMealLists = async (petId: number, dailyMealId: number) => {
  const response = await dailyMealsAPI.getSpecificMeal(petId, dailyMealId);
  console.log('응답:', response);
  return response.data;
};

export default function Page() {
  const petId = 2;
  const date = getTodayDate();
  const [dailyMeals, setDailyMeals] = useState<any>(null);
  const pathname = usePathname();
  const isValid = useRecoilValue(isCompleteValid);
  const setIsValid = useSetRecoilState(isCompleteValid);

  const setNotice = useSetRecoilState(noticeState);

  const [isCompleteModalOpen, setIsCompleteModalOpen] = useRecoilState(isCompleteModalOpenState);

  const fetchDailyMeals = async () => {
    try {
      const dailyMealResponse = await fetchdailyMealId(petId, '2024-07-17');
      if (dailyMealResponse && dailyMealResponse.data && dailyMealResponse.data.length > 0) {
        const dailyMealId = dailyMealResponse.data[0].dailyMealId;
        console.log('dailyMealId:', dailyMealId);
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

        const isCompleteValid = isConpleteValid(filteredData);
        console.log('isCompleteValid:', isCompleteValid);

        setIsValid(isCompleteValid);
        setDailyMeals(filteredData);
      } else {
        console.log('추가 식단x');
      }
    } catch (e) {
      console.error(e); // 에러
    }
  };

  useEffect(() => {
    fetchDailyMeals();
  }, [pathname]);

  const handleClick = () => {
    console.log('isValid:', isValid);
    if(!isValid) {
      setNotice({ isVisible: true, message: '추가된 식단이 없어요!' });
      return;
    }else {
      console.log('응:', isValid);
      setIsCompleteModalOpen(true);
    }
  };

  return (
    <>
      <Wrapper>
        <Image src={id_200} alt="id-200" priority />
        <AddButton />
        <div onClick={handleClick}>
        <StoreButton >
          <Image src={isValid ? StoreButtonActive : StoreButtonInactive} alt="store-button" />
        </StoreButton>
        </div>
        <NoticeContainer>
          <Notice />
        </NoticeContainer>
        <ContentContainer>
          {dailyMeals ? (
            <FoodCardsContainer dailyMeals={dailyMeals} />
          ) : (
            <EmptyMessage>식단을 불러오는 중이에요!</EmptyMessage>
          )}
        </ContentContainer>
      </Wrapper>
    </>
  );
}

const StoreButton = styled.div`
  width: 312px;
  position: relative;
  bottom: 200px;
  left: 24px;
  cursor: pointer;
`;

const NoticeContainer = styled.div``;

const ContentContainer = styled.div`
  margin-top: 20px;
  z-index: 10;
  position: absolute;
  top: 205px;
  left: 24px;
  height: 380px;
  max-height: 380px;
  width: 312px;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
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
  font-style: normal;
  font-weight: 400;
  line-height: 160%;
`;
