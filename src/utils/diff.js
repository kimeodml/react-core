import createDOM from '@/utils/createDOM';

export default function diff(oldVDOM, newVDOM, parentDOM) {
  // 1. 노드 타입이 다르면 새로 생성된 DOM을 교체
  if (!oldVDOM || oldVDOM.type !== newVDOM.type) {
    const newDOM = createDOM(newVDOM);
    parentDOM.replaceChild(newDOM, parentDOM.childNodes[0]);
    return;
  }

  // 2. 속성 비교 (props)
  const oldProps = oldVDOM.props || {};
  const newProps = newVDOM.props || {};

  // 속성 업데이트
  Object.keys(newProps).forEach(key => {
    if (key !== 'children' && oldProps[key] !== newProps[key]) {
      parentDOM[key] = newProps[key];
    }
  });

  // 삭제된 속성 처리
  Object.keys(oldProps).forEach(key => {
    if (!newProps.hasOwnProperty(key)) {
      parentDOM[key] = null;
    }
  });

  // 3. 자식 비교 (children)
  const oldChildren = oldProps.children || [];
  const newChildren = newProps.children || [];
  const maxLength = Math.max(oldChildren.length, newChildren.length);

  // 자식 노드 비교
  for (let i = 0; i < maxLength; i++) {
    diff(oldChildren[i], newChildren[i], parentDOM.childNodes[i]);
  }
}
