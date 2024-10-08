'use client';

import styled from "styled-components";
import Image from "next/image";
import Link from "next/link";
import backIcon from "@public/svg/back-button.svg?url";
import React, { useEffect } from 'react';
import userAPI from "@api/userAPI";
import { userDataState } from '@lib/atoms';
import { useRecoilState } from "recoil";
import toggle from '@public/svg/toggle.svg?url';
import { useRouter } from 'next/navigation';

interface UserData {
  loginMethod: string,
  name: string,
  email: string,
  receiveAd: boolean    
}

export default function Page() {
  const [user, setUser] = useRecoilState<UserData>(userDataState);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await userAPI.getUserInfo();
        const userData = response.data.data;
        setUser(userData);

        if (userData) {
          console.log(user);
        }
      } catch (error) {
        console.error('유저 정보 조회 실패', error);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      try {
        router.push('/'); 
        await userAPI.logout(accessToken);
        localStorage.clear(); // 모든 아이템 제거
      } catch (error) {
        console.error('로그아웃 실패', error);
      }
    } else {
      console.error('No access token found');
    }
  };

  const handleUserDelete = async () => {
      try {
        router.push('/'); 
        await userAPI.userDelete();
        localStorage.clear(); // 모든 아이템 제거
      } catch (error) {
        console.error('로그아웃 실패', error);
      }
  }; 


  const userInfoList = [
    { title: '로그인 방식', data: user.loginMethod },
    { title: '이름', data: user.name },
    { title: '이메일', data: user.email },
  ];

  return (
    <PageWrapper>
      <MypageHeader>
        <BackIconWrapper href={'/my-page'}>
          <BackIcon src={backIcon} alt="go back" />
        </BackIconWrapper>
        계정관리
      </MypageHeader>  

      <ContentWrapper>
        {userInfoList.map((info, index) => (
          <InfoWrapper key={index}>
            <Title>{info.title}</Title>
            <Info>{info.data}</Info>
          </InfoWrapper>
        ))}
        <Divider/>
        <ReceiveAdWrapper>
          <Info>마케팅 정보 수신 동의</Info>
          <Toggle src={toggle} alt="toggle"/>
        </ReceiveAdWrapper>
        <Divider/>
        <ClickkWrapper>
          <Title onClick={handleLogout}>로그아웃</Title>
          <Title onClick={handleUserDelete}>회원 탈퇴</Title>
        </ClickkWrapper>
      </ContentWrapper>
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MypageHeader = styled.h2`
  width: 100%;
  height: 3.25rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.colors['grey11']};
`;

const BackIconWrapper = styled(Link)`
  margin-left: 1.25rem;
  margin-right: 6.688rem;
`;

const BackIcon = styled(Image)``;

const ContentWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Divider = styled.div`
  width: 100%;
  height: 0.5rem;
  background-color: ${(props)=>props.theme.colors['grey2']};
`

const InfoWrapper = styled.div`
  width: 312px;
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
`;

const Title = styled.div`
  font-size: 1rem;
  font-weight: 400;
  line-height: 160%;
  color: ${(props) => props.theme.colors['grey7']};
  margin-bottom: 0.5rem;
  cursor: pointer;
`;

const Info = styled.div`
  font-size: 1rem;
  font-weight: 400;
  line-height: 160%;
  color: ${(props) => props.theme.colors['gre11']};
`;

const ReceiveAdWrapper = styled.div`
  width: 100%;
  height: 4.5rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

const ClickkWrapper = styled.div`
  width: 312px;
  display: flex;
  flex-direction: column;
  gap : 0.813rem;
  margin: 1.75rem 0;
`

const Toggle = styled(Image)`
  margin-left: 7.125rem;
  align-items: center;
`;
