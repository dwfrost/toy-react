import { createElement, Component, render } from './toy-react'

class MyComponent extends Component {
  constructor() {
    super()
    this.state = {
      a: 1,
      b: 2,
    }
  }
  render() {
    return (
      <div>
        <h1 class="h1-class">my component</h1>
        <div>{this.state.a.toString()}</div>
        <div>{this.state.b.toString()}</div>
        <button
          onClick={() => {
            this.state.a++
            return this.rerender()
          }}
        >
          add 手工操作
        </button>
        <button onClick={()=>{this.setState({a:this.state.a++})}}>add 使用setState</button>
        {this.children}
      </div>
    )
  }
}

// 调用render方法，将组件挂载在body节点上
render(
  <MyComponent id="a" class="b">
    <div class="c">test1</div>
  </MyComponent>,
  document.body
)
