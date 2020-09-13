// 核心 toy-react.js

// 思路：
// MyComponent 组件无法调用 setAttribute 和 appendChild 等方法
// 使用Wrapper包装，让其可以调用

const REDNER_TO_DOM = Symbol('render to dom')

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

  get vdom() {
    // vdom为什么由render决定？为什么会递归调用？
    return this.render().vdom
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
    this._vdom = this.vdom
    this._vdom[REDNER_TO_DOM](range)
  }

  update() {
    // 对比新旧node
    // 对比 type props children
    let isSameNode = (oldNode, newNode) => {
      console.log('isSameNode', oldNode, newNode)
      if (oldNode.type !== newNode.type) return false
      for (let name in newNode.props) {
        if (newNode.props[name] !== oldNode.props[name]) return false
      }
      if (Object.keys(oldNode.props).length > Object.keys(newNode.props).length)
        return false

      if (newNode.type === '#text') {
        if (newNode.content !== oldNode.content) return false
      }
      return true
    }

    // 更新dom
    const update = (oldNode, newNode) => {
      if (!oldNode) {
        // oldNode = newNode
        // return
        // TODO
      }
      console.log('oldNode', oldNode)
      if (!isSameNode(oldNode, newNode)) {
        newNode[REDNER_TO_DOM](oldNode._range)
        return
      }

      newNode._range = oldNode._range

      let newChildren = newNode.vChildren
      let oldChildren = oldNode.vChildren

      if (!newChildren || !newChildren.length) return

      let tailRange = oldChildren[oldChildren.length-1]._range

      for (let i = 0; i < newChildren.length; i++) {
        let newChild = newChildren[i]
        let oldChild = oldChildren[i]
        if (i < oldChildren.length) {
          update(oldChild, newChild)
        } else {
          console.log('todo')
          let range = document.createRange()
          range.setRange(tailRange.endContainer,tralRange.endOffset)
          range.setEnd(tailRange.endContainer,tailRange.endOffset)
          newChild[REDNER_TO_DOM](range)
          tailRange = range
        }
      }
    }

    let vdom = this.vdom
    console.log('this._vdom', this._vdom)
    update(this._vdom, this.vdom)
    this._vdom = vdom
  }

  setState(newState) {
    // 初始化
    if (this.state === null || typeof this.state !== 'object') {
      this.state = newState
      this.rerender()
      return
    }
    let merge = (oldState, newState) => {
      console.log('oldState, newState', oldState, newState)
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
    merge(this.state, newState)
    this.update()
  }

  // get root() {
  //   if (!this._root) {
  //     // todo
  //     this._root = this.render().root
  //   }
  //   return this._root
  // }
}

export class ElementWrapper extends Component {
  constructor(type) {
    // type:标签类型
    super(type)
    this.type = type
    // 定义root节点
    // root节点是干啥的？为啥叫root？在哪里用到？代表该dom根节点对象
    // 引入vdom之后，this.root就不需要了
    // this.root = document.createElement(type)
  }
  get vdom() {
    this.vChildren = this.children.map((child) => child.vdom)
    return this
    /*{
      type: this.type,
      props: this.props,
      children: this.children.map((child) => child.vdom),
    }*/
  }

  // 继承Component后，setAttribute和setAttribute也取自Component对应的方法
  /*
  // 实现 setAttribute
  setAttribute(name, value) {
    // 添加事件绑定
    if (name.match(/^on([\s\S]+)$/)) {
      // 兼容onClick => onclick
      this.root.addEventListener(
        RegExp.$1.replace(/^[\s\S]/, (c) => c.toLowerCase()),
        value
      )
    } else {
      if (name === 'className') {
        name = 'class'
      }
      this.root.setAttribute(name, value)
    }
  }

  // 实现 setAttribute 将其子组件挂载在该节点上
  appendChild(component) {
    let range = document.createRange()
    // 为什么start和end的第二个参数一样？
    range.setStart(this.root, this.root.childNodes.length)
    range.setEnd(this.root, this.root.childNodes.length)
    range.deleteContents()
    component[REDNER_TO_DOM](range)

    // this.root.appendChild(component.root)
  }
  */

  [REDNER_TO_DOM](range) {
    this._range = range

    let root = document.createElement(this.type)

    // 遍历所有属性，绑定事件，设置属性
    for (let name in this.props) {
      const value = this.props[name]
      if (name.match(/^on([\s\S]+)$/)) {
        // 兼容onClick => onclick
        root.addEventListener(
          RegExp.$1.replace(/^[\s\S]/, (c) => c.toLowerCase()),
          value
        )
      } else {
        if (name === 'className') {
          name = 'class'
        }
        root.setAttribute(name, value)
      }
    }

    if (!this.vChildren) {
      this.vChildren = this.children.map((child) => child.vdom)
    }

    // 挂载所有子节点
    for (let child of this.vChildren) {
      let childRange = document.createRange()
      childRange.setStart(root, root.childNodes.length)
      childRange.setEnd(root, root.childNodes.length)
      // childRange.deleteContents()
      child[REDNER_TO_DOM](childRange)
    }

    replaceContent(range, root)
  }
}
export class TextWrapper extends Component {
  constructor(content) {
    super(content)
    this.type = '#text'
    this.content = content
  }
  // 文本节点没有属性和子节点

  [REDNER_TO_DOM](range) {
    this._range = range
    let root = document.createTextNode(this.content)
    replaceContent(range, root)
  }
  get vdom() {
    return this /*{
      type: '#text',
      content: this.content,
    }*/
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
      if (child === null) continue
      if (typeof child === 'string') {
        // 处理文本节点
        child = new TextWrapper(child)
      }

      // 是否还有子节点
      if (typeof child === 'object' && child instanceof Array) {
        insertChildren(child)
      } else {
        // 挂载子节点
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

function replaceContent(range, node) {
  range.insertNode(node)
  range.setStartAfter(node)
  range.deleteContents()

  range.setStartBefore(node)
  range.setEndAfter(node)
}
