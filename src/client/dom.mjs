function render(parent, children) {
  parent.innerHTML = ''
  parent.append(...children)
}

function createElement(name, { id, class: className, disabled, text, onClick } = {}, children) {
  const el = document.createElement(name)

  id && (el.id = id)
  el.disabled = disabled
  onClick && el.addEventListener('click', onClick)
  className && el.classList.add(...(Array.isArray(className) ? className : [className]))
  text && (el.innerText = text)
  children && children.length && el.append(...children)

  return el
}

export { render, createElement as E }
