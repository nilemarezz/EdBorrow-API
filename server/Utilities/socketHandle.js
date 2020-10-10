const handleSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('socket connected - ' + socket.id)

    socket.on('disconnect', () => {
      console.log('Disconnected - ' + socket.id);
    });

    socket.on('room', (room) => {
      socket.join(room)
      console.log('join room', room)
    })

  })

}

module.exports = handleSocket;