import { render, E } from './dom.mjs'
import { Button } from './components.mjs'

const socket = io()

register()

let users, session

socket.on('users', newUsers => renderAll((users = newUsers), session))
socket.on('session', newSession => renderAll(users, (session = newSession)))

const cards = [0, 0.5, 1, 2, 3, 5, 8, 13, 20, 40, 100, 'INF', '?'].map(String)

function reset() {
  socket.emit('reset')
}

function renderAll(users = [], { answered = {}, answers = {} } = {}) {
  const $controls = document.getElementById('controls')
  const $users = document.getElementById('users')
  const $cards = document.getElementById('cards')

  render($controls, [
    Button({
      text: 'Reset',
      onClick: () => reset(),
    }),
  ])

  render(
    $users,
    users.map(user =>
      E('div', { class: 'user' }, [
        E('span', { text: userText(user) }),
        E('span', {
          class: ['estimate', answered[user.id] ? 'ready' : 'waiting'],
          text: answers[user.id] || (answered[user.id] ? 'READY' : 'WAITING'),
        }),
        user.id === socket.id
          ? Button({
              text: 'Change name',
              onClick: () => register(true),
            })
          : '',
      ])
    )
  )

  render(
    $cards,
    cards.map(card =>
      E('button', {
        class: 'card',
        text: card,
        disabled: users.every(user => session && session.answered[user.id]),
        onClick: e => socket.emit('estimate', { estimate: card }),
      })
    )
  )
}

function userText(user) {
  return (user.master ? '[M] ' : '') + user.name
}

function register(force) {
  const name = force
    ? prompt('Enter name') || ''
    : localStorage.getItem('name') || prompt('Enter name') || ''
  name && localStorage.setItem('name', name)
  socket.emit('join', { name })
}
