import "./MainPage.css";
import mainBackground from "../../assets/img/main-background.png";

const MainPage = () => {
  return (
    <div className="mainContainer">
      <img src={mainBackground} className="main-img"></img>
      <div className="homeContainer">
        <h1 className="mainText">
          당신이 찾던 모든 것,
          <br /> 첫 채팅을 해보세요
        </h1>
        <div className="ex">
          <div className="exQuestion1">
            <span className="exText1">
              오늘 대한민국 경기도 용인시 기흥구의 날씨는 어때?
            </span>
          </div>

          <div className="exQuestion2">
            <span className="exText2">2024년 학사 일정을 알려줘</span>
          </div>

          <div className="exQuestion1">
            <span className="exText1">최근 공지사항 알려줘</span>
          </div>

          <div className="exQuestion2">
            <span className="exText2">나 심심해 놀아줘라!!</span>
          </div>
          <h1 className="mainText2">모든 질문은 제가 대답할게요.</h1>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
