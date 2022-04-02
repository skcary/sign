
const Room = require('./room');
class User {
  constructor(send, roomName) {
    this._send = send;
    this.room = Room.get(roomName);
    this.name = null;

    console.log(`created chat in ${this.room.name}`);
  }

  send(data) {
    try {
      this._send(data);
    } catch {
    }
  }

  handleJoin(name) {
    if (this.room.getMembersCount() === 2) {
      this.send(JSON.stringify({ type: 'join', state: 'fail' }));
      return;
    }
    this.name = name;
    this.room.join(this);
    this.room.broadcast({
      type: 'join',
      state: 'success',
      names: this.room.getMembersName(),
      text: `${this.name} joined "${this.room.name}".`
    });
  }

  handleChat(text) {
    this.room.broadcast({
      name: this.name,
      type: 'chat',
      text: text
    });
  }

  handleSdp(msg) {
    this.room.broadcastSdp(msg, this);
  }

  handleMessage(jsonData) {
    try {
      const msg = JSON.parse(jsonData);
      if (msg.type === 'join') this.handleJoin(msg.name);
      else if (msg.type === 'chat') this.handleChat(msg.text);
      else if (['answer', 'answer_ice', 'offer', 'offer_ice'].includes(msg.type)) this.handleSdp(msg);
      else { }
    } catch (error) {
    }
  }

  handleClose() {
    this.room.leave(this);
    this.room.broadcast({
      type: 'exit',
      state: 'success',
      names: this.room.getMembersName(),
      text: `${this.name} left ${this.room.name}.`
    });
  }
}

module.exports = User;