import { createElement, Component, render } from './toy-react'

class MyComponent extends Component {
  render() {
    return (
      <div>
        <h1 class="h1-class">my component</h1>
        {this.children}
      </div>
    )
  }
}

// 调用render方法，将组件挂载在body节点上
render(
  <MyComponent id="a" class="b">
    <div class="c">test1</div>
    <div>test2</div>
  </MyComponent>,
  document.body
)
