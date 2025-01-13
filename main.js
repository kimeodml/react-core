import App from './src/index';
// import { createDOM } from './src/utils/createDOM';

// function render(element, container) {
//   const dom = createDOM(element);
//   container.appendChild(dom);
// }

const app = App();
// render(app, document.getElementById('root'))

console.log('element 추출', app);
console.log(JSON.stringify(app, null, 2));