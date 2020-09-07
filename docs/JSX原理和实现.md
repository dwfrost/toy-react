# JSX 原理和实现

1.安装 webpack wepback-cli

```sh
cnpm install webpack webpack-cli -D
```

2.新建 `webpack.config.js`

```js
module.exports = {
  entry: {
    main: './main.js',
  },
  mode: 'development',
  optimization: {
    minimize: false,
  },
}
```

输入`npx webpack`运行
查看 dist 目录，可以方便的看到打包后的文件

```js
eval('\n\n//# sourceURL=webpack:///./main.js?')
// 这里sourceURL可以在浏览器中进行文件映射，方便开发者调试
```

3.安装 babel-loader @babel/core @babel/preset-env

```sh
yarn add babel-loader @babel/core @babel/preset-env
```

可以使用 es6 新特性，但 babel 会将其转化为兼容低版本浏览器的语法。

4.安装 @babel/plugin-transform-react-jsx

```sh
yarn add @babel/plugin-transform-react-jsx
```

然后在`webpack.config.js`中修改 babel options

```js
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
+           plugins:['@babel/plugin-transform-react-jsx']
          },
        },
      },
    ],
  }
```

5.React 换名字
在 main.js 中写入 <div></div>，在 index.html 中引入打包好的 main.js，发现报错

```
React.createElement("div", null);
```

提示： React is not defined

可以对 babel 配置进行修改

```js
plugins: [['@babel/plugin-transform-react-jsx', { pragma: 'createElement' }]]
```

这样，`React.createElement`就改为了`createElement`

6.实现 `createElement`，并挂载在<body></body>

- 支持简易的标签挂载，属性设置，文本和子节点挂载
  具体代码及注释，参考 src/v1/main.js

7.实现自定义组件，抽离核心 react，props 及子节点

- 实现 ElementWrapper TextWrapper Component createElement

- 简易版 react，支持 元素渲染 子节点嵌套(类似slot)
  具体代码，参考 src/v2 目录
