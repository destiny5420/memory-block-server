const path = require('path')
const http = require('http')
const express = require('express')
const cors = require('cors')
const socketio = require('socket.io')
const formatMessage = require('./utils/messages')

const app = express()
const server = http.createServer(app)
const io = socketio(server, {
  cors: {
    origin: 'http://localhost:9000',
    methods: ['GET', 'POST'],
  },
})

const botName = 'ChatCord Bot'

io.on('connection', (socket) => {
  console.log('New WS Connection...')

  // Message from server
  socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!'))

  // Broadcast when a user connects
  socket.broadcast.emit('message', formatMessage(botName, 'A user has joined the chat'))

  // Runs when client disconnects
  socket.on('disconnect', () => {
    io.emit('message', formatMessage(botName, 'A user has left the chat'))
  })

  // Protocol - chatMessage
  socket.on('chatMessage', (data) => {
    io.emit('message', formatMessage('USER', data.msg))
  })
})

// // Set static folder
app.use(express.static(path.join(__dirname, 'public')))

const PORT = 9898 || process.env.PORT

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
