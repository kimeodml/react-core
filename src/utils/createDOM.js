export function createDOM(element) {
  if (typeof element === 'string' || typeof element === 'number') {
    return document.createTextNode(element); // 텍스트 노드를 반환
  }

  // 불리언 처리
  if (typeof element === 'boolean') {
    return document.createTextNode(element.toString());
  }

  const dom = document.createElement(element.type); // type에 맞는 DOM 요소를 생성

  // props를 순회하며 요소에 속성 설정 (className 등)
  Object.entries(element.props).forEach(([key, value]) => {
    if (typeof value === 'function' && key.startsWith('on')) {
      // 합성 이벤트 처리
      const eventType = key.slice(2).toLocaleLowerCase();
      dom.addEventListener(eventType, value); // ex) onClick -> click

      // onChange의 경우 브라우저에서 input의 이벤트와 동일함
      // 하지만 input으로 할 경우 한 자씩 입력하면 focus가 해제되는 문제가 존재
    }

    // 스타일 적용
    if (key === 'style' && typeof value === 'object') {
      Object.entries(value).forEach(([styleKey, styleValue]) => {
        dom.style[styleKey] = styleValue;
      });
    }

    // input 속성 + 기타 속성
    if (key === 'checked' || key === 'disabled' || key === 'value' || key !== 'children') {
      dom[key] = value;
    }
  });
  // children을 재귀적으로 생성
  element.props.children.map(createDOM).forEach(child => dom.appendChild(child));

  return dom; // 생성된 DOM 요소 반환
}
