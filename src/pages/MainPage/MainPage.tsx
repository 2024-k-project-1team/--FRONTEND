import "./MainPage.css";

const MainPage = () => {
  return (
    <div className="mainContainer">
      <div className="homeContainer">
        <div></div>
        <h1 className="mainEng">"Enables efficient task management"</h1>
        <h1 className="mainText">
          당신이 찾던 모든 것,
          <br /> 첫 채팅을 해보세요
        </h1>
        <div className="ex">
          <div className="exQuestion1">
            <div className="exText1">
              오늘 대한민국 경기도 용인시 기흥구의 날씨는 어때?
            </div>
            <div className="category1">☀️ 날씨보기</div>
          </div>

          <div className="exQuestion2">
            <div className="exText2">2024년 학사 일정을 알려줘</div>
            <div className="category2">🎓 학사 일정</div>
          </div>

          <div className="exQuestion1">
            <div className="exText1">최근 공지사항 알려줘</div>
            <div className="category1">🎬 전공 질문</div>
          </div>

          <div className="exQuestion2">
            <div className="exText2">나 심심해 놀아줘라!!</div>
            <div className="category2">🏘 일상대화</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
