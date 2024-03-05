const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {cors: {origin: "*"}});
const path = require('path'); 
const fs = require("fs");
const { title } = require('process');

// Cấu hình middleware để phục vụ các tệp từ thư mục /public
app.use(express.static(path.join(__dirname, "/public"))); 
app.set('views', path.join(__dirname, 'views')); 
app.set('view engine', 'ejs'); 

server.listen(3001, () => {
    console.log("Server running...");
});

const arrUserInfo = [];

app.get('/', (req, res) => {
  res.render('index'); // Trang chính của ứng dụng
});

// Route để phục vụ trang quiz và các tệp CSS và JavaScript liên quan
// app.get('/quiz', (req, res) => {0
//   res.sendFile(path.join(__dirname, 'public', 'quiz.html'));
// });

app.get('/quiz', (req, res) => {
  res.render('quiz'); // Sử dụng res.render thay vì res.sendFile
});
app.get('/style.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'styles.css')); 
});

app.get('/script.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'script.js')); 
});


// Middleware để phục vụ các tệp CSS từ thư mục /public
// app.get('/style.css', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'style.css'));
// });

// // Middleware để phục vụ các tệp JavaScript từ thư mục /public
// app.get('/script.js', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'script.js'));
// });

app.get('/getOnlineUsers', (req, res) => {
  res.json(arrUserInfo);
});



io.on('connection', (socket) => {
    // console.log("User connected: " + socket.id);
  
    socket.on('chat message', function(msg){
      io.emit('chat message', msg);
    });
  
      socket.on('NGUOI_DUNG_DANG_KY', user => {
        const isExist = arrUserInfo.some(e => e.name === user.name);
        
        socket.peerId = user.peerId;
  
        if(isExist) {
          return socket.emit('DANG_KY_THAT_BAI');
        }
  
        arrUserInfo.push(user);
        socket.emit('DANH_SACH_ONLINE', arrUserInfo);
        socket.broadcast.emit('CO_NGUOI_DUNG_MOI', user);
      });
  
      socket.on('disconnect', () => {
          const index = arrUserInfo.findIndex(user => user.peerId === socket.peerId);
          arrUserInfo.splice(index, 1);
          io.emit('USER_DISCONNECTED', socket.peerId);
      });
});
