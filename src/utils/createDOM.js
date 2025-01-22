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
    // 추후 data나 input의 value 같은 속성 고려 필요
    if (typeof value === 'function') {
      // 합성 이벤트 처리
      const eventType = key.slice(2).toLocaleLowerCase();
      dom.addEventListener(eventType, value); // ex) onClick -> click
    }
    if (key !== 'children') {
      dom[key] = element.props[key];
    }
  });

  // children을 재귀적으로 생성
  element.props.children.map(createDOM).forEach(child => dom.appendChild(child));

  return dom; // 생성된 DOM 요소 반환
}
