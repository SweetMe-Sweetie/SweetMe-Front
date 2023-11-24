import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { LoginAtom, LoginStateAtom } from '../../recoil/Login';
import { UserInfoAtom } from 'recoil/User';

import logo from '../../assets/logo.svg';
import defaultProfile from '../../assets/default_image.png';
import LoginModal from './LoginModal';
import NicknameModal from './NicknameModal';
import { getUserInfo } from 'api/user';

const Header = () => {
  const loginState = useRecoilValue(LoginStateAtom); // 로그인 여부
  const loginInfo = useRecoilValue(LoginAtom); // 로그인 정보
  const [userInfo, setUserInfo] = useRecoilState(UserInfoAtom); // 유저 정보
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // 로그인 모달 열림 유무
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false); // 닉네임 모달 열림 유무

  const navigate = useNavigate();

  // 처음 가입한 사용자인지 판단 -> 닉네임 설정 모달 열기
  useEffect(() => {
    if (loginInfo.isfirst) {
      setIsNicknameModalOpen(true);
    }
  }, []);

  const handleCreateClick = () => {
    if (loginState) {
      navigate('/create');
    } else {
      alert('로그인이 필요합니다.');
    }
  };

  // 로그인 모달 열기
  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  // 로고 클릭 시 메인페이지로 이동 + 새로고침
  const handleLogoClick = () => {
    window.location.href = '/';
  };

  useEffect(() => {
    if (loginState && !userInfo.profileImage) {
      const getUser = async () => {
        const res = await getUserInfo();
        const data = res?.data;
        if (data) {
          if (data.profileImage.startsWith('http://k.kakaocdn.net')) {
            setUserInfo({
              nickname: data.nickname,
              email: data.email,
              profileImage: data.profileImage,
            });
          } else {
            const imgURL = defaultProfile;
            setUserInfo({
              nickname: data.nickname,
              email: data.email,
              profileImage: imgURL,
            });
          }
        }
      };
      getUser();
    }
  }, []);

  return (
    <>
      <Div>
        <div className="div"></div>
        <Logo src={logo} onClick={handleLogoClick} />
        <BtnContainer>
          {loginState ? (
            <>
              <Btn onClick={handleCreateClick}>모집하기</Btn>
              <Profile href="/mypage">
                <Img src={userInfo.profileImage} />
              </Profile>
            </>
          ) : (
            <>
              <Btn onClick={handleCreateClick}>모집하기</Btn>
              <Btn onClick={handleLoginClick}>로그인</Btn>
            </>
          )}
        </BtnContainer>
      </Div>
      {isLoginModalOpen && <LoginModal setIsModalOpen={setIsLoginModalOpen} />}
      {isNicknameModalOpen && (
        <NicknameModal setIsModalOpen={setIsNicknameModalOpen} />
      )}
    </>
  );
};

const Div = styled.div`
  width: 69vw;
  height: 160px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: auto;
  @media (max-width: 800px) {
    width: 80vw;
  }
  .div {
    width: 180px;
    margin-left: 15px;
    @media (max-width: 800px) {
      display: none;
    }
  }
`;

const Logo = styled.img`
  width: 250px;
  cursor: pointer;
  @media (max-width: 800px) {
    width: 160px;
  }
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Profile = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  background-image: url(${defaultProfile});
  background-position: center center;
  background-repeat: no-repeat;
  background-size: contain;

  transition: opacity 200ms ease-in-out;

  &:hover {
    opacity: 0.6;
  }
`;

const BtnContainer = styled.div`
  width: 180px;
  display: flex;
  justify-content: space-between;
  margin-right: 15px;
  @media (max-width: 800px) {
    margin: 0;
    width: 130px;
  }
`;

const Btn = styled.button`
  font-family: 'suite';
  font-size: 18px;
  border: none;
  background-color: white;
  color: black;
  text-decoration: none;
  cursor: pointer;
`;

export default Header;
