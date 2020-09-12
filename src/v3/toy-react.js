// 核心 toy-react.js

// 思路：
// MyComponent 组件无法调用 setAttribute 和 appendChild 等方法
// 使用Wrapper包装，让其可以调用

const REDNER_TO_DOM = Symbol('render to dom')

export class ElementWrapper {
  constructor(type) {
    // 定义root节点
    // root节点是干啥的？为啥叫root？在哪里用到？代表该dom根节点对象
    this.root = document.createElement(type)
  }

  // 实现 setAttribute
  setAttribute(name, value) {
    // 添加事件绑定
    if (name.match(/^on([\s\S]+)$/)) {
      console.log(RegExp.$1)
      // 兼容onClick => onclick
      this.root.addEventListener(
        RegExp.$1.replace(/^[\s\S]/, (c) => c.toLowerCase()),
        value
      )
    } else {
      this.root.setAttribute(name, value)
    }
  }

  // 实现 appendChild 将其子组件挂载在该节点上
  appendChild(component) {
    let range = document.createRange()
    // 为什么start和end的第二个参数一样？
    range.setStart(this.root, this.root.childNodes.length)
    range.setEnd(this.root, this.root.childNodes.length)
    range.deleteContents()
    component[REDNER_TO_DOM](range)

    // this.root.appendChild(component.root)
  }
  [REDNER_TO_DOM](range) {
    range.deleteContents()
    range.insertNode(this.root)
  }
}
export class TextWrapper {
  constructor(content) {
    this.root = document.createTextNode(content)
  }
  // 文本节点没有属性和子节点

  [REDNER_TO_DOM](range) {
    range.deleteContents()
    range.insertNode(this.root)
  }
}

// 所有自定义组件需要继承该Component
export class Component {
  constructor() {
    // 创建一个绝对的空对象
    this.props = Object.create(null)

    // 子节点
    this.children = []

    // 私有属性
    this._root = null

    //  存储旧的range
    this._range = null
  }

  setAttribute(name, value) {
    // 属性未挂载？子元素挂载了，组件根标签的属性不挂载
    this.props[name] = value
  }

  // 挂载子节点
  appendChild(component) {
    this.children.push(component)
  }

  [REDNER_TO_DOM](range) {
    this._range = range
    this.render()[REDNER_TO_DOM](range)
  }

  rerender() {
    this._range.deleteContents()
    this[REDNER_TO_DOM](this._range)
  }

  setState(newState) {
    // 初始化
    if (this.state === null || typeof this.state !== 'object') {
      this.state = newState
      this.rerender()
      return
    }
    let merge = (oldState, newState) => {
      for (let p in newState) {
        // 直接拷贝
        if (oldState[p] === null || typeof oldState[p] !== 'object') {
          oldState[p] = newState[p]
        } else {
          // 如果有更深层级的对象属性，递归调用merge
          merge(oldState[p], newState[p])
        }
      }
    }
    merge()
    this.rerender()
  }

  get root() {
    if (!this._root) {
      // todo
      console.log('this', this)
      this._root = this.render().root
    }
    return this._root
  }
}

// 实现 createElement
// 第一个参数有可能是组件，有可能是html 标签
export function createElement(type, attributes, ...children) {
  let e
  if (typeof type === 'string') {
    // 普通标签
    e = new ElementWrapper(type)
    // e= document.createElement(type)
  } else {
    // 组件，实际是一个class,该class继承自Component
    e = new type()
  }

  for (let key in attributes) {
    // 处理属性，如id class
    e.setAttribute(key, attributes[key])
  }

  // 定义函数，内部调用自身，实现递归挂载子节点
  const insertChildren = (children) => {
    for (let child of children) {
      if (typeof child === 'string') {
        // 处理文本节点
        console.log('string', child)
        child = new TextWrapper(child)
      }

      // 是否还有子节点
      if (typeof child === 'object' && child instanceof Array) {
        insertChildren(child)
      } else {
        // 挂载子节点
        console.log('tag', child)
        e.appendChild(child)
      }
    }
  }

  insertChildren(children)
  return e
}

export function render(component, parentElement) {
  // parentElement.appendChild(component.root)

  let range = document.createRange()
  // 设置range的范围
  range.setStart(parentElement, 0)
  range.setEnd(parentElement, parentElement.childNodes.length)
  range.deleteContents()
  component[REDNER_TO_DOM](range)
}
