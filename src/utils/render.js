import createDOM from '@/utils/createDOM';
import diff from '@/utils/diff';

let oldVDOM = null;
let globalContainer = null;

export function getGlobalContainer() {
  return globalContainer;
}

export function render(element, container) {
  globalContainer = container;
  const newVDOM = element;

  if (oldVDOM) {
    // Diffing 알고리즘을 통해 변경된 부분만 업데이트
    console.log('container', container);
    diff(oldVDOM, newVDOM, container);
  } else {
    // 처음 렌더링 시 전체 DOM을 생성하여 넣어줌
    const dom = createDOM(newVDOM);
    container.appendChild(dom);
  }

  console.log('old', oldVDOM, 'new', newVDOM);

  // 이전 VDOM을 현재 VDOM으로 업데이트
  oldVDOM = newVDOM;
}
