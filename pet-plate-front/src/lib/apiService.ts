import axiosInstance from './axiosInstance';
import { nutrientAPI } from '@api/nutrientAPI';
import { dailyMealsAPI } from '@api/dailyMealsAPI';

// 식단 저장 -> 분석 진행
export const saveDailyMealsNutrients = async (petId: number) => {
  let isDoneAlready = localStorage.getItem('isDoneAlready') || '';
  console.log(isDoneAlready);

  try {
    //  if (!isDoneAlready) {
    const response = await axiosInstance.post(`/pet/${petId}/dailyMeals/nutrients`);
    console.log(response);

    return response;
    //   } else {
    //    return null;
    //  }
  } catch (e: any) {
    if (e.response.status === 400) {
      localStorage.setItem('isDoneAlready', '분석완료');
      return null;
    }
  }
};

// 섭취 적정 칼로리 등 수치적 분석 결과 조회
export const fetchPetNutrientData = async (petId: number, date?: string) => {
  try {
    const [nutrientsResponse, kcalResponse, kcalRatioResponse, properKcalResponse] = await Promise.all([
      nutrientAPI.getPetNutrients(petId, date),
      nutrientAPI.getPetKcal(petId, date),
      nutrientAPI.getPetKcalRatio(petId, date),
      nutrientAPI.getPetProperKcal(petId),
    ]);

    return {
      todayNutrients: nutrientsResponse.data,
      todayKcal: kcalResponse.data,
      todaykcalRatio: kcalRatioResponse.data,
      todayProperKcal: properKcalResponse.data,
    };
  } catch (error) {
    console.error('오류:', error);
    throw error;
  }
};

// pet 정보 업데이트 요청
export const updatePetInfo = async (petId: number, petData: any) => {
  try {
    const response = await axiosInstance.put(`/pets/${petId}`, petData);
    console.log('업뎃 결과', response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const petId = 3;
const petData = {
  name: '이아지',
  age: 2,
  weight: 13,
  activity: 'ACTIVE',
  neutering: 'NEUTERED',
};

// 식사 내역 전체 삭제

export const handleDeleteAllMeals = async (petId: number, dailyMealId: number) => {
  try {
    await Promise.all([
      dailyMealsAPI.deleteBookmarkRawMeals(petId, dailyMealId),
      dailyMealsAPI.deletePackagedSnacks(petId, dailyMealId),
      dailyMealsAPI.deleteBookmarkFeeds(petId, dailyMealId),
      dailyMealsAPI.deleteBookmarkPackagedSnacks(petId, dailyMealId),
      dailyMealsAPI.deleteFeeds(petId, dailyMealId),
      dailyMealsAPI.deleteRawMeals(petId, dailyMealId),
    ]);
    alert('모든 식단이 성공적으로 삭제되었습니다.');
  } catch (error) {
    console.error('식단 삭제 중 오류 발생:', error);
    alert('식단 삭제 중 오류가 발생했습니다.');
  }
};
