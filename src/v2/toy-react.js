// 核心 toy-react.js

// 思路：
// MyComponent 组件无法调用 setAttribute 和 appendChild 等方法
// 使用Wrapper包装，让其可以调用

export class ElementWrapper {
  constructor(type) {
    // 定义root节点
    // root节点是干啥的？为啥叫root？在哪里用到？代表该dom根节点对象
    this.root = document.createElement(type)
  }

  // 实现 setAttribute
  setAttribute(name, value) {
    this.root.setAttribute(name, value)
  }

  // 实现 appendChild 将其子组件挂载在该节点上
  appendChild(component) {
    this.root.appendChild(component.root)
  }
}
export class TextWrapper {
  constructor(content) {
    this.root = document.createTextNode(content)
  }
  // 文本节点没有属性和子节点
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

  }

  setAttribute(name, value) {
    // 属性未挂载？子元素挂载了，组件根标签的属性不挂载
    this.props[name] = value
  }

  // 挂载子节点
  appendChild(component) {
    this.children.push(component)
  }

  get root() {
    if (!this._root) {
      // todo
      console.log('this',this)
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
        console.log('string',child)
        child = new TextWrapper(child)
      }

      // 是否还有子节点
      if (typeof child === 'object' && child instanceof Array) {
        insertChildren(child)
      } else {
        // 挂载子节点
        console.log('tag',child)
        e.appendChild(child)
      }
    }
  }

  insertChildren(children)
  return e
}

export function render(component, parentElement) {
  parentElement.appendChild(component.root)
}
