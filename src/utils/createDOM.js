export default function createDOM(element) {
  if (typeof element === 'string' || typeof element === 'number') {
    return document.createTextNode(element); // 텍스트 노드를 반환
  }

  // 불리언 처리
  if (typeof element === 'boolean') {
    return document.createTextNode(element.toString());
  }

  const dom = document.createElement(element.type); // type에 맞는 DOM 요소를 생성

  const props = element.props || {};
  // props를 순회하며 요소에 속성 설정 (className 등)
  Object.entries(props).forEach(([key, value]) => {
    if (typeof value === 'function' && key.startsWith('on')) {
      // 합성 이벤트 처리
      const eventType = key.slice(2).toLocaleLowerCase();
      dom.addEventListener(eventType, value); // ex) onClick -> click
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

  // children이 배열일 경우에만 map 사용
  if (props.children) {
    (Array.isArray(props.children) ? props.children : [props.children])
      .map(createDOM)
      .forEach(child => dom.appendChild(child));
  }

  return dom; // 생성된 DOM 요소 반환
}
