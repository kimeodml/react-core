import { createDOM } from '@/utils/createDOM';

let globalContainer = null;

export function render(element, container) {
  globalContainer = container;
  container.innerHTML = '';
  const dom = createDOM(element);
  container.appendChild(dom);
}

export function getGlobalContainer() {
  return globalContainer;
}
