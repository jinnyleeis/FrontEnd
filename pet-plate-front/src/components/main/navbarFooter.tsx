'use client';

import styled from 'styled-components';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

// 아이콘 이미지 임포트
import homeIcon from '@public/svg/home-icon.svg?url';
import analyzeIcon from '@public/svg/analyze-icon.svg?url';
import myPageIcon from '@public/svg/my-page-icon.svg?url';
import homeIconActive from '@public/svg/home-icon-green.svg?url';
import analyzeIconActive from '@public/svg/analyze-icon-green.svg?url';
import myPageIconActive from '@public/svg/my-page-icon-green.svg?url';

interface NavItemsType {
  id: number;
  src: string;
  active: string;
  alt: string;
  link: string;
  clickable: boolean;
}

export default function NavbarFooter() {
  const pathname = usePathname();
  const [analyzeLink, setAnalyzeLink] = useState('/main/analyze-info');
  const [isPetEnrolled, setIsPetEnrolled] = useState<boolean | null>(null);

  //로그인 하지 않은 경우에는 null
  useEffect(() => {
    const enrollPet = localStorage.getItem('enrollPet');
    if (enrollPet === 'true') {
      setIsPetEnrolled(true);
      setAnalyzeLink('/main/analyze');
    } else if (enrollPet === 'false') {
      setIsPetEnrolled(false);
      setAnalyzeLink('/main/analyze-info');
    } else {
      setIsPetEnrolled(null);
    }
  }, []);

  const NavItems: NavItemsType[] = [
    {
      id: 1,
      src: homeIcon,
      active: homeIconActive,
      alt: 'home',
      link: '/main',
      clickable: true,
    },
    {
      id: 2,
      src: analyzeIcon,
      active: analyzeIconActive,
      alt: 'analyze',
      link: analyzeLink,
      clickable: isPetEnrolled !== null,
    },
    {
      id: 3,
      src: myPageIcon,
      active: myPageIconActive,
      alt: 'my-page',
      link: '/my-page',
      clickable: isPetEnrolled !== null,
    }
  ];

  return (
    <NavbarContainer>
      {NavItems.map(({ id, src, active, alt, link, clickable }) => (
        <IconWrapper href={clickable ? link : '#'} key={id} clickable={clickable}>
          <Image
            src={pathname === link ? active : src}
            alt={alt}
            width={48}
            height={48}
          />
        </IconWrapper>
      ))}
    </NavbarContainer>
  );
}

// NavbarContainer 스타일 컴포넌트
const NavbarContainer = styled.div`
  width: 100%;
  height: 5rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 4em;
  position: absolute;
  bottom: 0;
  z-index: 1000;
  background-color: #fff;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.05);
`;

// IconWrapper 스타일 컴포넌트
const IconWrapper = styled(Link)<{ clickable: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${(props) => (props.clickable ? 1 : 0.5)};
  pointer-events: ${(props) => (props.clickable ? 'auto' : 'none')};
`;

// Icon 스타일 컴포넌트
const Icon = styled(Image)`
  width: 3rem;
  height: 3rem;
`;
