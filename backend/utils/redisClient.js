// require('dotenv').config();
// const { createClient } = require('redis');

// // Update the URL to point to the Redis container (use 'redis' as hostname)
// const redisClient = createClient({
//     url: process.env.REDIS_URL,
//     socket: {
//         reconnectStrategy: retries => {
//             console.log(`Reconnecting to Redis, attempt ${retries}`);
//             return Math.min(retries * 100, 3000); // exponential backoff
//         },
//         keepAlive: 5000, // milliseconds, helps keep the socket open
//         connectTimeout: 10000,
//     },
// });


// redisClient.on('error', (err) => console.error('Redis Client Error', err));

// (async () => {
//     try {
//         await redisClient.connect();
//         console.log('Connected to Redis');
//     } catch (err) {
//         console.error('Failed to connect to Redis', err);
//     }
// })();

// module.exports = redisClient;