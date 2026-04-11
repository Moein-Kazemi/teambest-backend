//  these above code write with chat gpt for create chat room from all users.

/* 
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const Message = require('./models/Message');

const app = express();
app.use(cors());
app.use(express.json());

// اتصال به MongoDB
mongoose.connect('mongodb://localhost:27017/team-bast')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('کاربر متصل شد:', socket.id);

  // ارسال پیام‌های قبلی به کاربر جدید
  socket.on('load-messages', async () => {
    try {
      const messages = await Message.find().sort({ createdAt: 1 }).limit(50);
      socket.emit('previous-messages', messages);
    } catch (error) {
      console.error('خطا در دریافت پیام‌ها:', error);
    }
  });

  // دریافت پیام از کاربر و ذخیره در دیتابیس
  socket.on('send-message', async (data) => {
    try {
      // ذخیره پیام در دیتابیس
      const newMessage = new Message({
        username: data.username,
        message: data.message,
        time: data.time
      });
      
      await newMessage.save();
      
      // ارسال پیام به همه کاربران
      io.emit('receive-message', {
        username: data.username,
        message: data.message,
        time: data.time
      });
    } catch (error) {
      console.error('خطا در ذخیره پیام:', error);
    }
  });

  // حذف پیام (اختیاری)
  socket.on('delete-message', async (messageId) => {
    try {
      await Message.findByIdAndDelete(messageId);
      io.emit('message-deleted', messageId);
    } catch (error) {
      console.error('خطا در حذف پیام:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('کاربر قطع شد:', socket.id);
  });
});

server.listen(5000, () => {
  console.log('Server running on port 5000');
});
*/
