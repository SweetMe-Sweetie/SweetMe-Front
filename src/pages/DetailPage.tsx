import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

import Header from 'components/_common/Header';
import { Container, Body, Border } from 'components/_common/pageLayout';
import { Study } from 'components/_common/props';
import DetailHeader from 'components/detailpage/DetailHeader';
import DetailBox from 'components/detailpage/DetailBox';
import DetailText from 'components/detailpage/DetailText';
import BtnGroup from 'components/detailpage/BtnGroup';
import { UserInfoAtom } from 'recoil/User';
import { defaultStudy } from 'components/_common/props';

import { getStudyDetail } from 'api/studydetail';

const DetailPage = () => {
  const { postId } = useParams();
  const postIdAsNumber = postId ? parseInt(postId) : 0;

  const [studyDetail, setStudyDetail] = useState<Study>(defaultStudy);
  const [studyContent, setStudyContent] = useState('');

  const userInfo = useRecoilValue(UserInfoAtom); // 사용자 이름
  const [creater, setCreater] = useState<string | undefined>(undefined); // 모집글 작성자 이름

  // 스터디 상세 내용 api 호출
  useEffect(() => {
    getStudyDetail(postIdAsNumber).then((res) => {
      setStudyDetail(res?.data);
      setStudyContent(res?.data.content);
      setCreater(res?.data.memberName);
    });
  }, [postIdAsNumber]);

  return (
    <Container>
      <Header />
      <DetailHeader study={studyDetail} />
      <Border />
      <Body>
        <DetailBox study={studyDetail} />
      </Body>
      <Border />
      <TextWrapper>
        <DetailText content={studyContent} />
        {/* 사용자가 작성한 글일때만 보이게 하기 */}
        {creater === userInfo.nickname && <BtnGroup />}
      </TextWrapper>
    </Container>
  );
};

export default DetailPage;

const TextWrapper = styled.div`
  width: 100%;
  position: relative;
`;
