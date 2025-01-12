export function createElement(type, props, ...children) {
  console.log("createElement 호출", type, props, children)
  return {
    type,
    props: {
      ...props,
      children
    }
  }
}