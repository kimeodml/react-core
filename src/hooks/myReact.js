import App from '@/index';
import { render, getGlobalContainer } from '@/utils/render';

// 훅 호출 순서를 보장하기 위해 useState과 useEffect는 변수를 서로 공유함
const globalState = []; // 상태 저장소
let currentKey = 0; // 현재 상태의 인덱스를 관리하는 변수

export function useState(initialValue) {
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
        // currentKey = 0;
        // render(App(), container); // 리렌더링 실행
        queueMicrotask(() => {
          currentKey = 0;
          render(App(), container);
        });
      }
    }
  };

  return [state, setState];
}

export function useEffect(callback, deps) {
  const currentIndex = currentKey++; // useState와 동일한 방식으로 상태 인덱스

  // 이전 의존성 배열과 클린업 함수를 가져옴 (없으면 [null, null]로 초기화)
  const [lastDeps, cleanup] = globalState[currentIndex] || [null, null];

  // 의존성 배열이 변경되었는지 확인
  const hasChanged = !deps || !lastDeps || deps.some((dep, i) => dep !== lastDeps[i]);

  if (hasChanged) {
    // 이전 클린업 함수가 있다면 실행
    if (cleanup) cleanup();

    // queueMicrotask 사용하여 콜백을 렌더링 후에 실행
    queueMicrotask(() => {
      const newCleanup = callback();
      globalState[currentIndex] = [deps, newCleanup];
    });
  }
}
