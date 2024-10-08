'use Client'

import { useRecoilState } from 'recoil';
import styled from "styled-components";
import InputField from "@components/input-data1/inputField";
import { petInfoState } from '@lib/atoms';


export default function NameContent() {
  const [petInfo, setPetInfo] = useRecoilState(petInfoState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    const updatedPetInfo = { ...petInfo, name: newName };
    setPetInfo(updatedPetInfo);
  };


  return (
    <ContentWrapper>
      <Title>반려견의 이름은 무엇인가요?</Title>
      <InputField
        placeholder="이름"
        width="19.5rem"
        value={petInfo.name}
        onChange={handleChange}
      />
    </ContentWrapper>
  );
}


const ContentWrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
`

const Title = styled.h1`
    font-size: 1.25rem;
    font-weight: bold;
    line-height: 160%;
    
    margin-bottom: 1.125rem;
    width: 100%;
    padding-left: 25px;
`