export function createElement(type, props, ...children) {

  if (typeof type === "function") {
    return type(null, props, ...children); // 컴포넌트일 경우
  }

  return {
    type,
    props: {
      ...props,
      children
    }
  };
}
