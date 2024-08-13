export const formatMessage = (message: string): string => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const formattedMessage = message
    .replace(/\n/g, "<br>")
    .replace(
      urlRegex,
      '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
    );

  return formattedMessage;
};

//formatMessage 함수: 서버로부터 받은 메세지를 html로 변환하는 역할 => 줄바꿈, 링크 처리 해결
//줄바꿈: (\n) -> <br> 태그로 변환
//링크: 택스트 내 url 감지 -> <a> 태그로 변환
