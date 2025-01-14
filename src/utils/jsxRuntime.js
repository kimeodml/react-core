// 단일
export function jsx(type, props, key) {
  return {
    type,
    props: {
      ...props,
      key // list 항목 렌러딩을 위한 key값
    }
  };
}

// 다중
export function jsxs(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children // children을 배열로 포함
    }
  };
}