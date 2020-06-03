function getSessionName(sessionId) { 
  return `session: ${sessionId}`;
}

class RedisSessionStore {
  constructor(client) {
    this.client = client;
  }

  // 获取Redis中存储的session数据
  async get(sessionId) {
    const id = getSessionName(sessionId);
    const data = await this.client.get(id);
    if (!data) return null;
    try {
      const result = JSON.parse(data); 
      return result;
    } catch (error) {
      console.log(error); 
    }
  }

  // 存储session数据到Redis中
  async set(sessionId, data, maxAge) {
    const id = getSessionName(sessionId);
    const time = maxAge / 1000;
    try {
      const sessionStr = JSON.stringify(data);
      if (time !== 0) {
        await this.client.setex(id, time, sessionStr);
      } else {
        await this.client.set(id, sessionStr);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // 从Redis中删除session
  async destroy(sessionId) {
    const id = getSessionName(sessionId);
    await this.client.del(id);
  }
}

module.exports = RedisSessionStore;

