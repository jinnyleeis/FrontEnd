// ExitButtonImage.tsx
'use client';
import styled from 'styled-components';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

const ExitButtonStyleWrapper = styled(Image)`
  grid-area: exit-button; /* 이미지를 exit-button 영역에 배치 */
  position: relative; /* 절대적인 위치를 고정 */
  top: 72px; /* 화면 상단에 고정 */
  left: -3px; /* 좌측 정렬 */
  z-index: 6; /* 다른 요소보다 위에 배치 */
  cursor: pointer; /* 마우스 커서를 손가락 모양으로 변경 */
`;

export default function ExitButtonImage({ src, alt }: { src: string; alt: string }) {
  const router = useRouter();
  return <ExitButtonStyleWrapper src={src} alt={alt} onClick={() => router.push(`/201`)} />;
}
