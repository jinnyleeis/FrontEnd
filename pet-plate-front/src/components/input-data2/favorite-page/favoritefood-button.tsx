'use client';

import StoreButton from '@components/input-data2/common/StoreButton';
import { useAddBookmarkToDailyMeals } from '@hooks/useAddBookmarkToDailyMeals';
import { useRecoilValue } from 'recoil';
import { selectedItemState } from '@recoil/favoritePageAtoms';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';

export default function FavoriteButton() {
  const { addBookmarkRaw, addBookmarkFeed, addBookmarkPackagedSnack } = useAddBookmarkToDailyMeals();
  const router = useRouter();
  const selectedItem = useRecoilValue(selectedItemState);

  const handleClick = () => {
    if (!selectedItem) {
      alert('입력 양식을 확인해 주세요.');
      return;
    }

    switch (selectedItem.type) {
      case '자연식':
        addBookmarkRaw.mutate(
          { petId: 3, bookMarkedRawId: selectedItem.id },
          {
            onSuccess: () => {
              alert('즐겨찾기에 저장되었습니다.');
              router.push('/201', { scroll: false });
            },
            onError: () => {
              alert('저장 중 오류가 발생했습니다.');
            },
          },
        );
        break;

      case '사료':
        addBookmarkFeed.mutate(
          { petId: 3, bookMarkedFeedId: selectedItem.id },
          {
            onSuccess: () => {
              alert('즐겨찾기에 저장되었습니다.');
              router.push('/201', { scroll: false });
            },
            onError: () => {
              alert('저장 중 오류가 발생했습니다.');
            },
          },
        );
        break;

      case '포장 간식':
        addBookmarkPackagedSnack.mutate(
          { petId: 3, bookMarkedPackagedSnackId: selectedItem.id },
          {
            onSuccess: () => {
              alert('즐겨찾기에 저장되었습니다.');
              router.push('/201', { scroll: false });
            },
            onError: () => {
              alert('저장 중 오류가 발생했습니다.');
            },
          },
        );
        break;

      default:
        alert('알 수 없는 음식 유형입니다.');
    }
  };

  return (
    <ButtonWrapper>
      <StoreButton onClick={handleClick} />
    </ButtonWrapper>
  );
}

const ButtonWrapper = styled.div`
  position: absolute;
  top: 0px;
`;
