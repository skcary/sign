const express = require('express');
const app = express();
const wsInstance = require('express-ws')(app);
const User = require('./user');
const port = process.env.PORT || 3000;

app.ws('/s/:id', (ws, req) => {
  try {
    const user = new User(
      ws.send.bind(ws),
      req.params.id,
    );

    ws.on('message', data => {
      try {
        user.handleMessage(data);
      } catch (err) {
        console.error(err);
      }
      // const obj = JSON.parse(data);
      // if (obj.type === 'join' && obj.userId) {
      // }

      // wsInstance.getWss().clients.forEach(client => {
      //   if (client !== ws) {
      //     const obj = JSON.parse(data);
      //     if (obj.type !== 'heartbeat') client.send(data);
      //   }
      // });
    });

    ws.on('close', function () {
      try {
        user.handleClose();
      } catch (err) {
        console.error(err);
      }
    });
  } catch (err) {
    console.error(err);
  }
});

app.get('/', (req, res) => {
  res.send('hello');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});