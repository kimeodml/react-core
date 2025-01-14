## 개발 환경 구축과 JSX 이해하기
### JSX
- 리액트는 JSX 문법을 사용
- JSX란, JS를 확장한 문법으로, JS 파일을 HTML과 비스하게 마크업을 작성할 수 있도록 해줌
  ```
  export default function App() {
    return (
      <div className="container">
        <h1>Hello, JSX!!!!!!!!!!!!!!!!!</h1>
      </div>
    );
  }
  ```

### Babel
- 하지만 브라우저는 JSX 문법을 해석하지 못하기 때문에 `Babel`(트랜스파일러)이 브라우저가 읽을 수 있는 JS 형식으로 바꿔줌
  ```
  // Before
  import React from "react";
  
  export default function App() {
    return (
      <div className="container">
        <h1>Hello, JSX!</h1>
      </div>
    );
  }

  // After
  import React from "react";

  export default function App() {
    return React.createElement(
      "div",
      { className: "container" },
      React.createElement("h1", null, "Hello, JSX!")
    );
  }
  ```
- 이 때 호출하는 것이 `React.createElement`로 `createElement`를 통해 JS 객체 형태의 element(React element)를 반환함
- 반환된 element는 실제 DOM을 생성한 것이 아니라, 가상 DOM 객체를 생성한 것
- 따라서 실제 DOM을 생성하는 createDOM이라는 함수가 추가적으로 필요

### JSXRuntime
- React 17에서 등장한 새로운 트랜스파일 방식
- babel.config.json을 아래와 같이 `automatic`으로 변환하면 새로운 트랜스파일 방식으로 변환됨
  ```
  {
    "presets": [
      ["@babel/preset-env"],
      ["@babel/preset-react", { "runtime": "automatic" }]
    ]
  }
  ```
- React 17 이전에 호출했던 `React.createElement`가 `jsx`또는 `jsxs`로 대체되어 호출됨
   - `jsx` - 단일
   - `jsxs` - 다중
- 따라서 `import React from 'react'`가 불필요해짐
  ```
  import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";

  export default function App() {
    return _jsx("div", {
      className: "container",
      children: _jsx("h1", {
        children: "Hello, JSX!"
      })
    });
  }
  ```

### 동작 순서
1. 생성한 JSX를 Babel이 트랜스파일함
    ```
    <div className="a">Hi</div>
    ```
2. 트랜스파일된 코드는 createElement를 호출(React 17 이후는 jsx/jsxs 호출)
    ```
    createElement('div', { className: 'a' }, 'Hi')
    ```
3. createElement가 element를 반환(= React element)
    ```
    const element = {
      type: 'div',
      props: {
        className: 'a',
        children: 'Hi',
      }
    }
    ```
4. 반환된 element로 createDOM을 이용해 실제 DOM을 생성