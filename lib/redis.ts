import { createClient } from "redis";

let redis: ReturnType<typeof createClient>


if (!global.__redis) {
    redis = createClient({
        url: process.env.REDIS_URL
    })

    redis.connect().catch(err => console.error('Redis is mad -_-', err))

    global.__redis = redis
} else {
    redis = global.__redis
}

export default redis

declare global {
    var __redis: ReturnType<typeof createClient> | undefined
}