const handleSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('socket connected - ' + socket.id)

    socket.on('disconnect', () => {
      console.log('Disconnected - ' + socket.id);
    });

    socket.on('date', (date) => {
      socket.join(date)
      console.log('date return', date)
    })

  })

}

module.exports = handleSocket;