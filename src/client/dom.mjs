function render(parent, children) {
  parent.innerHTML = ''
  parent.append(...children)
}

function createElement(
  name,
  { id, class: className, text, placeholder, autofocus, onChange, onSubmit, onClick, value } = {},
  children
) {
  const el = document.createElement(name)

  id && (el.id = id)
  value && (el.value = value)
  el.autofocus = autofocus
  onClick && el.addEventListener('click', onClick)
  onSubmit && el.addEventListener('submit', onSubmit)
  onChange && el.addEventListener('input', onChange)
  className && el.classList.add(...(Array.isArray(className) ? className : [className]))
  text && (el.innerText = text)
  placeholder && (el.placeholder = placeholder)
  children && children.length && el.append(...children)

  return el
}

export { render, createElement as E }
