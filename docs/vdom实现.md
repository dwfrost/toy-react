# vdom 实现

### 建立虚拟 dom

- 引入 vdom 之后，之前的 root 就不需要了
- 让 ElementWrapper 和 TextWrapper 继承自 Component
- 分别实现 vdom getter，如下

```js
// Component
get vdom(){
  return this.render().vdom
}
// ElementWrapper
get vdom(){
  // this.包含type,props,children等属性
  return this
}
// TextWrapper
get vdom(){
  return this
}

```

在 main.js 中可以打印组件，查看 vdom 结构

### 将 vdom 渲染成实体 dom

修改 ElementWrapper 的[REDNER_TO_DOM]方法

- 重写 root
- 遍历 props，绑定事件，设置属性
- 遍历挂载所有子节点

完成虚拟 dom 转化为实体 dom， tutorial 可以正常跑起来 

### 比对新旧dom，并更新实体dom 
