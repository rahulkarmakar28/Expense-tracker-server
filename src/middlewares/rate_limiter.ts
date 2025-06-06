import ratelimiter from '../config/upstash'
import { MiddlewareHandler } from 'hono'
import { getConnInfo } from 'hono/bun'

export const rateLimiter: MiddlewareHandler = async (c, next) => {
    try {
        const userIp =
        c.req.raw.headers.get('true-client-ip') ||
        c.req.raw.headers.get('cf-connecting-ip') ||
        getConnInfo(c).remote.address as string
        // console.log('Client IP:', userIp);
        
        const { success } = await ratelimiter.limit(userIp)
        if (!success) {
            return c.json("Too many requests, please wait for 1 minute", 429)
        }
        await next()
    } catch (error) {
        console.error('Rate limiter error:', error)
        return c.json({ error: 'Internal server error' }, 500)
    }
}
export default rateLimiter;