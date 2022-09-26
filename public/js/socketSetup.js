var socket = io();
console.log('socket activated');
console.log(socket);
socket.on('testEvent', (data) => console.log('emit received', data));
socket.on('connect_error', (err) => console.log(err));