import { Hono } from 'hono'
import { DB_Connect } from './config/db'
import transactionRoute from './api/transaction'
import authRoute from "./api/auth"
import rateLimiter from './middlewares/rate_limiter'
import {job} from './config/cron'



const app = new Hono()

export const db = DB_Connect()
if (process.env.NODE_ENV === 'production') job.start()
app.use(rateLimiter)

app.get('/', (c) => c.text('Hello Hono!'))
app.get('/api/health', (c) => c.json({ success: true, message: 'API is healthy' }))
app.route('/api/transaction', transactionRoute)
app.route('/api/auth', authRoute)
app.onError((err, c) => c.json({ message: 'Internal Server Error', error: err.message }, 500))
app.get('*', (c) => c.text('This is a catch-all route. Please use / for the greeting.'))


export default app