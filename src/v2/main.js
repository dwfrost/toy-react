import { createElement, Component, render } from './toy-react'

class MyComponent extends Component {
  render() {
    return (
      // <div>my component</div>
      <div>
        <h1>my component</h1>
        {this.children}
      </div>
    )
  }
}

// 版本1
// // window.aa = (
// const aa = (
//   <MyComponent id="a" class="b">
//     <div>test</div>
//     <div></div>
//   </MyComponent>
// )

// document.body.appendChild(aa)

// 版本2
// 调用render方法，将组件挂载在body节点上
render(
  <MyComponent id="a" class="b">
    <div>test1</div>
    <div>test2</div>
  </MyComponent>,
  document.body
)
