'use client';

import styled from 'styled-components';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Container>
      <Padding></Padding>
      <Contents>{children}</Contents>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Padding = styled.div`
  width: 100%;
  height: 44px;
  //상단 탭 임의 설정
`;
const Contents = styled.div`
  width: 100%;
`;
