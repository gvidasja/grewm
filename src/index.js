const express = require('express')
const httpServer = require('http')
const socketIo = require('socket.io')
const path = require('path')

const { PORT = 3000, HOST = '0.0.0.0' } = process.env

const app = express()
const server = httpServer.createServer(app)
const io = socketIo(server)

let users = []
let session = {
  task: null,
  answers: {},
  answered: {},
}

app
  .get('/', (_, res) => res.sendFile(path.resolve(__dirname, 'client', 'index.html')))
  .use('/', express.static(path.resolve(__dirname, 'client')))

io.on('connection', socket => {
  socket.on('join', ({ name }) => {
    updateUsers([...users.filter(user => user.id !== socket.id), { id: socket.id, name }])
    updateSession(session)
  })
  socket.on('disconnect', () => updateUsers(users.filter(x => x.id !== socket.id)))
  socket.on('session', () => {
    updateUsers(users.map(user => (user.id === socket.id ? { ...user, master: true } : user)))
    updateSession()
  })
  socket.on('task', ({ task }) => updateSession({ task }))
  socket.on('estimate', ({ estimate }) =>
    updateSession({
      answers: { ...session.answers, [socket.id]: estimate },
      answered: { ...session.answered, [socket.id]: true },
    })
  )
})

function updateUsers(newUsers) {
  io.emit('users', (users = newUsers))
}

function updateSession(
  { task, answers = {}, answered = {} } = { task: null, answers: {}, answered: {} }
) {
  session = { task, answers, answered }

  const sessionToSend = users.every(user => session.answered[user.id])
    ? session
    : { task: session.task, answered: session.answered }

  io.emit('session', sessionToSend)
}

server.listen(PORT, HOST, () => console.log(`Listening on http://${HOST}:${PORT}`))
