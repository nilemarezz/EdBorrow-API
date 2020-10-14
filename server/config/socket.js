const handleSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('a user connected');
    socket.emit("FromAPI", `socket connect from server : ${new Date()}`);
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
}

module.exports = handleSocket;