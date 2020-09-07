// 实现 createElement
function createElement(tagName, attributes, ...children) {
  let e = document.createElement(tagName)
  for (let key in attributes) {
    // 处理属性，如id class
    e.setAttribute(key, attributes[key])
  }
  for (let child of children) {
    if (typeof child === 'string') {
      // 处理文本节点
      child = document.createTextNode(child)
    }
    // 挂载子节点
    e.appendChild(child)
  }
  return e
}

// window.aa = (
const aa = (
  <div id="a" class="b">
    <div>test</div>
    <div></div>
  </div>
)

document.body.appendChild(aa)
