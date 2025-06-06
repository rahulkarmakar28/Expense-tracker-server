import {Hono} from 'hono'


const app = new Hono()


app.get('/create-user', (c) => {
  const data = c.req.json()
  console.log('Received data:', data)
  return c.json({ success: true, data: data }, 200)
})
export default app