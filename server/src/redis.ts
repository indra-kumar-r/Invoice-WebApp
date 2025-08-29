import { Redis } from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redis = new Redis({
    host: '127.0.0.1',
    port: 6379,
});

redis.on('connect', () => {
    console.log('Redis connected');
});

redis.on('error', (error: any) => {
    console.error('Redis connection error:', error);
});

export default redis;
