import createDOM from '@/utils/createDOM';

export default function diff(oldVDOM, newVDOM, parentDOM) {
  // 1. 노드 타입이 다르면 새로 생성된 DOM을 교체
  if (!oldVDOM || oldVDOM.type !== newVDOM.type) {
    const newDOM = createDOM(newVDOM);
    parentDOM.replaceChild(newDOM, parentDOM.childNodes[0]);
    return;
  }

  // 2. 속성 비교
  const oldProps = oldVDOM.props || {};
  const newProps = newVDOM.props || {};

  updateAttributes(oldProps, newProps, parentDOM);

  // 3. 자식 비교 (children)
  const oldChildren = oldProps.children || [];
  const newChildren = newProps.children || [];
  const maxLength = Math.max(oldChildren.length, newChildren.length);

  // 자식 노드 비교
  for (let i = 0; i < maxLength; i++) {
    // parentDOM.childNodes[i] undefined 오류 해결 필요...
    diff(oldChildren[i], newChildren[i], parentDOM.childNodes[i]);
  }
}

function updateAttributes(oldProps, newProps, parentDOM) {
  Object.keys(newProps).forEach(key => {
    if (key !== 'children' && oldProps[key] !== newProps[key] && parentDOM) {
      if (key.startsWith('on')) {
        // 이벤트 리스너 추가
        const eventType = key.slice(2).toLowerCase();
        parentDOM.addEventListener(eventType, newProps[key]);
      }
      if (key === 'style') {
        // 스타일 업데이트
        Object.entries(newProps[key]).forEach(([styleKey, styleValue]) => {
          parentDOM.style[styleKey] = styleValue;
        });
      }
      // 일반 속성 추가 또는 업데이트
      if (key === 'checked' || key === 'disabled' || key === 'value' || key !== 'children') {
        parentDOM[key] = newProps[key];
      }
    }
  });

  // 삭제된 속성 처리
  Object.keys(oldProps).forEach(key => {
    if (!newProps.hasOwnProperty(key) && parentDOM) {
      if (key.startsWith('on')) {
        // 이벤트 리스너 제거
        const eventType = key.slice(2).toLowerCase();
        parentDOM.removeEventListener(eventType, oldProps[key]);
      }
      if (key === 'style') {
        // 스타일 제거
        Object.keys(oldProps[key]).forEach(styleKey => {
          parentDOM.style[styleKey] = '';
        });
      }
      // 일반 속성 제거
      if (key === 'checked' || key === 'disabled' || key === 'value' || key !== 'children') {
        parentDOM.removeAttribute(key);
      }
    }
  });
}
