import Redis from 'ioredis';

const redis = new Redis({
  host: '127.0.0.1',
  port: 6379
});

redis.ping()
  .then(res => {
    console.log('✅ Redis connected:', res); // ตอบ "PONG"
  })
  .catch(err => {
    console.error('❌ Redis connection failed:', err.message);
  });

export default redis;
