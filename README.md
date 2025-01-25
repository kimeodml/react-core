[1. 개발 환경 구축과 JSX 이해하기](#개발-환경-구축과-jsx-이해하기) <br />
[2. 렌더링과 상태 관리 구현하기](#렌더링과-상태-관리-구현하기)

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

## 렌더링과 상태 관리 구현하기

### useState
#### state
- React에서 `state`은 컴포넌트의 내부에서 변경 가능한 데이터를 다루기 위해 사용하는 훅임
- let, const 등으로 선언한 변수는 값이 변경되어도 화면이 바뀌지 않기 때문에 React에서는 `state`를 사용함

#### setState
- React에서 값을 변경하려면 `setState`을 활용해 값을 변경함
- 상태가 변경되면 React는 해당 상태를 사용한 컴포넌트와 하위 컴포넌트를 리렌더링하여 화면에 변경 사항을 반영함
- `setState`은 비동기적으로 작동함
  - 여러개의 setState 호출이 발생하면 성능 문제가 발생할 수 있기 때문에 React는 **일괄 업데이트**로 상태를 모아서 한 번에 업데이트함


### 렌더링
> 렌더링은 모든 컴포넌트에게 현재 state와 props값의 조합을 기반으로 각각의 UI를 어떻게 화면에 띄우고 싶어 하는지 물어보는 React의 프로세스입니다. - Mark Erikson (Redux Maintainer)

- 렌더링은 두 종류의 단계를 거침
  1. Render Phase
      - 컴포넌트 함수가 호출되어 React element를 반환함
      - 이 과정에서 React는 새로운 Virtual DOM을 생성하고, 이전 Virtual DOM과 비교(diffing)하여 변경 사항을 계산함
  2. Commit Phase
      - Render Phase에서 계산된 변경 사항을 실제 DOM에 반영
      - DOM 업데이트, 레이아웃 조정, 부수효과 실행 등 화면에 변화를 적용

#### 렌더링 조건
1. 상태(state) 변경
2. Props 변경 + Key 변경
3. 부모 컴포넌트가 렌더링
4. Context 값 변경
5. `useReducer`를 통한 변경



### 상태 업데이트와 리렌더링 과정

```
import React, { useState } from 'react';

function MyComponent() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <p>{count}</p>
    </div>
  );
}
```
1. button을 클릭하면 이벤트가 실행 setCount로 상태 업데이트 예약
2. 이벤트 루프가 종료되면 상태 업데이트 일괄처리
3. count + 1 로 최종상태 결정
4. 이전 상태값과 다르기에 리렌더링 실행
5. count + 1 최종상태 값 반환
6. 새로운 JSX 스냅샷 저장
7. 이전 JSX 스냅샷과 새로운 JSX 스냅샷 비교
8. `<p>` 태그 내부의 텍스트가 변경되므로, 실제 `<p>` DOM 변경
9. `<button>` 태그는 변경되지 않았으므로, 이 부분은 그대로 유지

