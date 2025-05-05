const { createClient } = require('redis');

// Update the URL to point to the Redis container (use 'redis' as hostname)
const redisClient = createClient({
    url: process.env.REDIS_URL,  // 'redis' is the service name in Docker Compose
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

(async () => {
    try {
        await redisClient.connect();
        console.log('Connected to Redis');
    } catch (err) {
        console.error('Failed to connect to Redis', err);
    }
})();

module.exports = redisClient;