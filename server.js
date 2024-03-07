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

// Route để phục vụ trang index.ejs
app.get('/', (req, res) => {
  res.render('index');
});

// Route để phục vụ trang quiz.ejs
app.get('/quiz', (req, res) => {
  res.render('quiz');
});

// Middleware để phục vụ các tệp CSS từ thư mục /public
app.get('/style.css', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.sendFile(path.join(__dirname, 'public', 'style.css'));
});

// Middleware để phục vụ các tệp JavaScript từ thư mục /public
app.get('/script.js', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.sendFile(path.join(__dirname, 'public', 'script.js'));
});


// Route để cập nhật trang index.ejs
app.get('/update', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.sendFile(path.join(__dirname, 'views', 'index.ejs')); // Sử dụng res.render để render trang index từ template EJS
});


// Route để phục vụ trang quiz và các tệp CSS và JavaScript liên quan
// app.get('/quiz', (req, res) => {0
//   res.sendFile(path.join(__dirname, 'public', 'quiz.html'));
// });

// Middleware để phục vụ các tệp CSS từ thư mục /public
// app.get('/style.css', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'style.css'));
// });

// // Middleware để phục vụ các tệp JavaScript từ thư mục /public
// app.get('/script.js', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'script.js'));
// });

// Route để cập nhật trang index.ejs



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
