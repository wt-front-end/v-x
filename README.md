# v-x 脱敏自定义指令

<p align="center">
  脱敏自定义指令
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@watone/v-x">
    <img src="https://img.shields.io/npm/v/@watone/v-x?color=orange&label=" alt="版本" />
  </a>
  <a href="https://github.com/qmhc/@watone/v-x/blob/main/LICENSE">
    <img src="https://img.shields.io/npm/l/@watone/v-x" alt="许可证" />
  </a>
</p>
## 简介

v-x 是一个 Vue 自定义指令,用于实现数据脱敏功能。它可以对敏感信息如身份证号、姓名、电话号码和地址进行掩码处理,以保护用户隐私。

## 功能特点

- 支持多种数据类型的脱敏:身份证、姓名、电话、地址
- 可自定义脱敏规则
- 支持输入框和文本元素
- 提供点击和悬停切换明文/密文的功能
- 兼容 placeholder 属性

## 安装




## 安装

```bash
npm install @watone/v-x
```
## 使用
```javascript
import Vue from 'vue'
import VX from '@watone/v-x'
app.directives('x', VX)
new Vue({
  el: '#app',
  template: '<div></div>'
})
```

##  在模板中使用:
``` html

<input v-x:idCard v-model="idCardNumber" />
<span v-x:name>张三</span>
```


## API

### 指令参数

- `idCard`: 身份证号脱敏
- `name`: 姓名脱敏
- `phone`: 电话号码脱敏
- `addr`: 地址脱敏

### 修饰符

- `click`: 启用点击切换明文/密文
- `hover`: 启用悬停切换明文/密文

### 绑定值

- `'switchTrue'`: 显示明文
- `'switchFalse'`: 显示密文

## 示例
