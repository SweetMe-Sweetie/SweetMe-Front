import { useState } from 'react';
import styled from 'styled-components';
import { useRecoilState } from 'recoil';

import { ModalProps } from '../_common/props';
import { UserInfoAtom } from 'recoil/User';
import { patchNickname, unlinkUser } from 'api/user';

const NicknameEditModal = ({ setIsModalOpen }: ModalProps) => {
  const [userInfo, setUserInfo] = useRecoilState(UserInfoAtom);
  const [nickname, setNickname] = useState(userInfo.nickname);

  // input 값 관리
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    const specialCharacterRegex = /[()+{}\[\]:;<>,?~\\"']/;
    if (specialCharacterRegex.test(value)) {
      alert('특수문자는 닉네임에 포함할 수 없습니다.');
    } else {
      setNickname(e.target.value);
    }
  };

  // 저장 클릭 or 엔터 클릭
  const handleSubmit = async (e: React.FormEvent) => {
    // 새로고침 방지
    e.preventDefault();

    if (!nickname) {
      alert('닉네임을 입력해 주세요');
      return;
    }

    // 닉네임 patch api 호출
    const res = await patchNickname(nickname);
    console.log('닉변', res);
    if (res?.status === 200) {
      setUserInfo({
        ...userInfo,
        nickname: nickname,
      });
      console.log(nickname);
      setIsModalOpen(false);
    }
  };

  const handleWithdrawalClick = async () => {
    // 회원 탈퇴 api 호출
    const res = await unlinkUser();
    if (res?.status === 200) {
      window.localStorage.clear();
      window.location.href = '/';
    }
  };

  return (
    <Div>
      <Container>
        <XBtn>
          <div onClick={() => setIsModalOpen(false)}>X</div>
        </XBtn>
        <p>변경할 닉네임을 입력해주세요!</p>
        <Form>
          <input type="text" value={nickname} onChange={handleInputChange} />
          <button onClick={handleSubmit}>저장</button>
          {/* <button className="withdrawal" onClick={handleWithdrawalClick}>
            회원 탈퇴
          </button> */}
        </Form>
      </Container>
    </Div>
  );
};

const Div = styled.div`
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  position: fixed;
  background: rgba(217, 217, 217, 0.5);
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  border-radius: 15px;
  background: #fff;
  width: 650px;
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  p {
    font-size: 32px;
    text-align: center;
    margin: auto;
    margin: 20px;
  }
`;

const XBtn = styled.div`
  color: black;
  font-size: 32px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  display: flex;
  justify-content: end;
  width: 100%;
  padding: 15px;
  div {
    cursor: pointer;
  }
`;

// 탈퇴 버튼 있을 때 style 주석 처리
const Form = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  //height: 200px;
  height: 135px;
  //margin-bottom: 25px;
  // 탈퇴 버튼 없을 때 style 추가
  margin-top: 10px;
  justify-content: space-between;
  input {
    border-radius: 90px;
    border: 1px solid #000;
    background: #fff;
    width: 290px;
    height: 50px;
    font-size: 30px;
    padding: 15px;
  }
  button {
    width: 250px;
    height: 55px;
    font-size: 28px;
    text-align: center;
    border-radius: 15px;
    background: #ffe2e2;
    color: black;
    cursor: pointer;

    // 회원 탈퇴 버튼 css
    &.withdrawal {
      border-radius: 15px;
      border: 5px solid rgba(255, 226, 226, 0.93);
      background: #fff;
    }
  }
`;

export default NicknameEditModal;
