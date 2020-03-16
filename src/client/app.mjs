import { render, E } from './dom.mjs'
import { Form, Input } from './components.mjs'

const socket = io()

register()

let users, session

socket.on('users', newUsers => renderAll((users = newUsers), session))
socket.on('session', newSession => renderAll(users, (session = newSession)))

const cards = [0, 0.5, 1, 2, 3, 5, 8, 13, 20, 40, 100, 'INF', '?'].map(String)

function renderAll(users = [], { task, answered = {}, answers = {} } = {}) {
  const $task = document.getElementById('task')
  const $users = document.getElementById('users')
  const $cards = document.getElementById('cards')

  render($task, [
    Form(
      { onSubmit: _ => socket.emit('task', { task: document.getElementById('task-input').value }) },
      [
        Input({
          autofocus: true,
          id: 'task-input',
          value: task,
          placeholder: 'Enter task...',
        }),
      ]
    ),
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
          ? E('button', {
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
      E('div', {
        class: 'card',
        text: card,
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
