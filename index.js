/*
 * @Author: xkloveme
 * @Date: 2024-05-28 16:45:56
 * @LastEditTime: 2024-08-29 17:47:13
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
  style.textContent = css
  if (document.head) {
    document.head.appendChild(style)
  } else {
    console.error('No <head> element found in the document.')
  }
}
loadStyleString(`
  .tuomindiv:empty::before {
    content: attr(placeholder);
    color: var(--el-text-color-placeholder);
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
  if (placeholder) {
    div.setAttribute('placeholder', placeholder)
  }
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
    input?.value || input.childNodes?.[0]?.textContent || input.childNodes?.[0]?.wholeText,
  )
  div.textContent = newValue
}

export default {
  mounted(el, binding) {
    if (binding.value === false) return
    const handler = handlers[binding.arg] || handlers.default
    let input = el.querySelector('input')
    const div = createMaskElement(input, el)
    if (!input) {
      el.style.position = 'relative'
      el.style.userSelect = 'none'
      div.style.position = 'absolute'
      el.appendChild(div)
      input = el
      if (binding.modifiers?.click) {
        el.addEventListener('click', () => toggleVisibility(div, input))
      }
      if (binding.modifiers?.hover) {
        el.addEventListener('mousemove', () => toggleVisibility(div, input))
      }
    } else {
      // fix: 解决dom塌陷
      el.style.minWidth = '150px'
      input.parentNode.insertBefore(div, input.nextSibling)
      div.addEventListener('click', () => {
        toggleVisibility(div, input)
        input.focus()
      })
      input.addEventListener('blur', () => toggleVisibility(div, input))
    }
    setTextContent(div, handler, input)
    toggleVisibility(div, input)
  },
  updated(el, binding) {
    if (binding.value === false) return
    const handler = handlers[binding.arg] || handlers.default
    const div = el.querySelector('.tuomindiv')
    let input = el.querySelector('input')
    if (!input) {
      input = el
      setTextContent(div, handler, input)
    } else {
      setTimeout(() => {
        setTextContent(div, handler, input)
      }, 900)
    }

    // v-x:name="'switchTrue'" 明文不脱敏
    // v-x:name="'switchFalse'" 密文脱敏
    if (binding.value !== binding.oldValue) {
      toggleVisibility(div, input, binding)
    }
  },
}
