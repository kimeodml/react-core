import App from '@/index';
import { render, getGlobalContainer } from '@/utils/render';

const globalState = []; // 상태 저장소
let currentKey = 0; // 현재 상태의 인덱스를 관리하는 변수

export default function useState(initialValue) {
  const stateIndex = currentKey++; // 상태 인덱스 저장

  // 상태가 초기화되지 않았으면 초기값 저장
  if (globalState[stateIndex] === undefined) {
    globalState[stateIndex] = initialValue;
  }

  const state = globalState[stateIndex]; // 상태 저장

  const setState = newValue => {
    // 함수형 업데이트 고려
    const newState = typeof newValue === 'function' ? newValue(globalState[stateIndex]) : newValue;

    if (globalState[stateIndex] !== newState) {
      globalState[stateIndex] = newState; // 상태를 새로운 값으로 업데이트

      const container = getGlobalContainer(); // 전역 컨테이너 가져오기

      if (container) {
        currentKey = 0; // 렌더링 전에 상태 인덱스 초기화
        render(App(), container); // 리렌더링 실행
      }
    }
  };

  return [state, setState];
}
