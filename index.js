/*
 * @Author: xkloveme
 * @Date: 2024-05-28 16:45:56
 * @LastEditTime: 2025-09-29 17:11:08
 * @LastEditors: huwb 15001206751@139.com
 * @Description: 脱敏自定义指令
 * @FilePath: \v-x\index.js
 * @Copyright © xkloveme
 */
import { mask_address, mask_idcard, mask_name, mask_phone } from 'jxk'

const handlers = {
  idCard: mask_idcard,
  name: mask_name,
  phone: mask_phone,
  addr: mask_address,
  default: mask_idcard,
}

function loadStyleString(css) {
  const style = document.createElement('style')
  style.id = '__v-x-style__'
  style.textContent = css
  document.head.appendChild(style)
}

loadStyleString(`
  .tuomindiv:empty::before {
    content: attr(placeholder);
    color: rgb(192, 196, 204);
  }
`)

const createMaskElement = (input, elm) => {
  const el = input || elm
  const div = document.createElement('div')
  div.className = el.className + ' tuomindiv'
  div.style.width = '100%'
  div.style.top = '0'
  div.style.left = '0'
  div.style.display = 'flex'
  div.style.alignItems = 'center'
  div.style.color = window.getComputedStyle(el, null).getPropertyValue('color') || '#000'
  div.style.userSelect = 'text'
  const placeholder = input?.getAttribute('placeholder')
  if (placeholder) div.setAttribute('placeholder', placeholder)
  return div
}

const toggleVisibility = (div, input, binding = {}) => {
  let showInput = false
  if (binding.value) {
    showInput = binding.value === 'switchTrue'
  } else {
    showInput =
      input.tagName === 'INPUT'
        ? input.style.display === 'none'
        : input.style.color === 'transparent'
  }

  if (input.tagName === 'INPUT') {
    input.style.display = showInput ? '' : 'none'
  } else {
    input.style.color = showInput ? div.style.color : 'transparent'
  }
  div.style.display = showInput ? 'none' : 'flex'
}

const setTextContent = (div, handler, input) => {
  const newValue = handler(
    input?.value || input.childNodes?.[0]?.textContent || input.childNodes?.[0]?.wholeText
  )
  div.textContent = newValue
}

function watchInputValue(input, callback) {
  const descriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(input), 'value');
  Object.defineProperty(input, 'value', {
    get() {
      return descriptor.get.call(this);
    },
    set(v) {
      const old = descriptor.get.call(this);
      descriptor.set.call(this, v);
      if (v !== old) {
        callback && callback(v, old);
        // 派发 change 事件，兼容已有监听
        this.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  });
}

function watchElValue(el, callback) {
  const observer = new MutationObserver(mutations => {
    let v = mutations[0].target.textContent
    let old = el.value
    if (old !== v) {
      el.value = v
      callback && callback(v, old);
    }
  });
  observer.observe(el, { childList: true, characterData: true, subtree: true });
}

// 核心方法，兼容 Vue2/3
const applyDirective = (el, binding) => {
  if (binding.value === false) return
  const handler = handlers[binding.arg] || handlers.default
  let input = el.querySelector('input')
  const div = el.querySelector('.tuomindiv') || createMaskElement(input, el)

  if (!input) {
    if (!el.contains(div)) {
      el.style.position = 'relative'
      el.style.userSelect = 'none'
      div.style.position = 'absolute'
      el.appendChild(div)
    }
    input = el

    if (binding.modifiers?.click) {
      el.addEventListener('click', () => toggleVisibility(div, input))
    }
    if (binding.modifiers?.hover) {
      el.addEventListener('mousemove', () => toggleVisibility(div, input))
    }
    watchElValue(el, () => setTextContent(div, handler, input))
  } else {
    if (!el.contains(div)) {
      el.style.minWidth = '150px'
      input.parentNode.insertBefore(div, input.nextSibling)
    }
    div.addEventListener('click', () => {
      toggleVisibility(div, input)
      input.focus()
    }, false)
    input.addEventListener('blur', () => {
      toggleVisibility(div, input, binding)
    }, false)
    input.addEventListener('change', () => {
      setTextContent(div, handler, input)
    }, false)
    watchInputValue(input);
  }
  setTextContent(div, handler, input)
  toggleVisibility(div, input, binding)
}

// 导出兼容 Vue2 + Vue3 的指令
export default {
  // Vue3 生命周期
  mounted(el, binding) {
    applyDirective(el, binding)
  },
  // Vue2 生命周期
  bind(el, binding) {
    applyDirective(el, binding)
  }
}
