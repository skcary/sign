const app = require('express')();
const wsInstance = require('express-ws')(app);

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