const ROOMS = new Map();

class Room {

  static get(roomName) {
    if (!ROOMS.has(roomName)) {
      ROOMS.set(roomName, new Room(roomName));
    }

    return ROOMS.get(roomName);
  }

  constructor(roomName) {
    this.name = roomName;
    this.members = new Set();
  }

  join(member) {
    this.members.add(member);
  }

  leave(member) {
    this.members.delete(member);
  }

  getMembersCount() {
    return this.members.size;
  }

  getMembersName() {
    const membersName = [];
    for (let member of this.members) {
      membersName.push(member.name);
    }
    return membersName;
  }

  broadcast(data) {
    for (let member of this.members) {
      member.send(JSON.stringify(data));
    }
  }

  broadcastSdp(data, member) {
    for (let m of this.members) {
      if (m !== member) {
        m.send(JSON.stringify(data))
      }
    }
  }

}

module.exports = Room;