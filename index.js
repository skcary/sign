const app = require('express')();
const wsInstance = require('express-ws')(app);
const port = process.env.PORT || 3000;

app.ws('/s', ws => {
  ws.on('message', data => {
    wsInstance.getWss().clients.forEach(client => {
      if (client !== ws) {
        const obj = JSON.parse(data);
        if (obj.type !== 'heartbeat') client.send(data);
      }
    });
  });
});

app.get('/', (req, res) => {
  res.send('hello');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});