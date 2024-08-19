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
              소프트웨어 개발자가 되고 싶은데 어떤 수업을 들어야 할까?
            </div>
            <div className="category1">📆 로드맵 짜기</div>
          </div>

          <div className="exQuestion2">
            <div className="exText2">학부 동아리는 뭐가 있어?</div>
            <div className="category2">👨‍💻 동아리 정보</div>
          </div>

          <div className="exQuestion1">
            <div className="exText1">우리 학교 교수님들은 누가 있어?</div>
            <div className="category1">🎓 학교 정보</div>
          </div>

          <div className="exQuestion2">
            <div className="exText2">학부 전화번호가 뭐야?</div>
            <div className="category2">🏫 학부 정보</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
