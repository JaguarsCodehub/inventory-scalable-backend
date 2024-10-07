import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL || '',
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

export async function connectRedis() {
  await redisClient.connect();
  console.log('Redis Client Connected');
}

export default redisClient;
