import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Button, Input } from "antd";
import axios from "axios";
import { SearchLoginUser } from "../recoil/LoginUser";
import { useRecoilValue } from "recoil";

const Main: React.FC<any> = () => {
  const [data, setData] = useState<any>([]);
  const [contents, setContents] = useState<string>("");

  const email = localStorage.getItem("email");
  const fetchData = () => {
    try {
      const loadingData = async () => {
        const DBdata = await axios.get("http://localhost:4000/boards");
        setData(DBdata.data);
      };
      loadingData();
    } catch (error) {
      console.log(error);
      alert("일시적인 오류가 발생하였습니다. 고객센터로 연락주세요.");
    }
  };

  useEffect(() => {
    // TODO: 해당 useEffect는 최초 마운트시에만 동작하게 제어
    fetchData();
  }, []);

  const handleBoardSubmit = (e: any) => {
    e.preventDefault();
    try {
      const addDBdata = async () => {
        const newData = {
          email,
          contents,
          isDeleted: false,
          id: crypto.randomUUID(),
        };
        await axios.post("http://localhost:4000/boards", newData);
        setData([...data, newData]);
        setContents("");
      };
      addDBdata();
      window.location.reload();
    } catch (error) {
      alert("일시적인 오류가 발생하였습니다. 고객센터로 연락주세요.");
    }
    // TODO: 자동 새로고침 방지
    // TODO: 이메일과 contents를 이용하여 post 요청 등록(isDeleted 기본값은 false)
    // TODO: 네트워크 등 기타 문제인 경우, "일시적인 오류가 발생하였습니다. 고객센터로 연락주세요." alert
    // TODO: 성공한 경우, "작성이 완료되었습니다. 아직 자동 새로고침이 불가하여 수동으로 갱신합니다." alert
    // TODO: 처리완료 후, reload를 이용하여 새로고침
  };

  const handleInputChange = (e: any) => {
    setContents(e.target.value);
  };

  const deleteButton = async (id: string) => {
    const deleteBoard = data.filter((item: any) => item.id !== id);
    await axios.delete(`http://localhost:4000/boards/${id}`);
    setData(deleteBoard);
  };

  return (
    <MainWrapper>
      <h1>메인 리스트 페이지</h1>
      <StyledForm onSubmit={handleBoardSubmit}>
        <StyledInput
          placeholder="방명록을 입력해주세요."
          value={contents}
          onChange={handleInputChange}
        />
      </StyledForm>
      <ListWrapper>
        {data.map((item: any, index: number) => (
          <ListItem key={item.id}>
            <span>
              {index + 1}. {item.contents}
            </span>
            {/* // TODO: 로그인 한 user의 이메일과 일치하는 경우에만 삭제버튼 보이도록 제어 */}
            {item.email === email ? (
              <Button onClick={() => deleteButton(item.id)}>삭제</Button>
            ) : null}
          </ListItem>
        ))}
      </ListWrapper>
    </MainWrapper>
  );
};

export default Main;

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ListWrapper = styled.div`
  width: 50%;
  padding: 10px;
`;

const ListItem = styled.div`
  margin-bottom: 5px;
  display: flex;
  justify-content: space-between;
`;

const StyledInput = styled(Input)`
  width: 50%;
`;

const StyledForm = styled.form`
  width: 100%;
  text-align: center;
`;
