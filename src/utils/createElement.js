export function createElement(type, props, ...children) {
  props = props || {};

  if (typeof type === 'function') {
    return type(null, props, ...children); // 컴포넌트일 경우
  }

  return {
    type,
    props: {
      ...props,
      children: children.flat(), // 배열일 경우 중첩 배열이 되기 때문에 평탄화 작업 필요
    },
  };
}
