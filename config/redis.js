const redisClient = require("redis");
const config = require("./config");
// initialize redis client
const redis = redisClient.createClient({
  url: `redis://${config.redis.REDIS_HOST}:${config.redis.REDIS_PORT}`,
});

redis.connect().catch(console.error);
module.exports = redis;
