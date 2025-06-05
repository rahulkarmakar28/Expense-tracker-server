import { Hono } from 'hono';
import { transactionTable } from '../db/transaction';
import { zValidator } from '@hono/zod-validator';
import { db } from "../index"
import { z } from '@hono/zod-openapi';
import { eq, sum } from "drizzle-orm";

const app = new Hono();


const createTransactionSchema = z.object({
    userId: z.number().int(),
    title: z.string(),
    amount: z.number().int(),
    category: z.string(),
})
const getTransactionsSchema = z.object({
    userId: z.string()
})
const deleteTransactionSchema = z.object({
    id: z.string()
})
const getTransactionSummarySchema = z.object({
    userId: z.string()
})




app.post('/',
    zValidator('json', createTransactionSchema),
    async (c) => {
        try {
            const { userId, title, amount, category } = c.req.valid('json')
            const result = await db.insert(transactionTable).values({
                userId,
                title,
                amount,
                category,
            })
            return c.json({ "success": true, "data": result }, 201)
        } catch (error) {
            console.error('Error inserting transaction:', error)
            return c.json({ error: 'Failed to create transaction' }, 500)
        }
    }
)
app.get('/:userId',
    zValidator('param', getTransactionsSchema),
    async (c) => {
        const { userId } = c.req.valid('param')
        try {
            const transactions = await db.select().from(transactionTable).where(eq(transactionTable.userId, Number(userId)))
            return c.json({ "success": true, "data": transactions }, 200)
        } catch (error) {
            console.error('Error fetching transactions:', error)
            return c.json({ error: 'Failed to fetch transactions' }, 500)
        }
    }

)
app.delete('/:id',
    zValidator('param', deleteTransactionSchema),
    async (c) => {
        const id = c.req.param('id')
        try {
            const result = await db.delete(transactionTable).where(eq(transactionTable.id, Number(id)))
            console.log('Delete result:', result)
            if (result.rowCount === 0) {
                return c.json({ error: 'Transaction not found' }, 404)
            }
            return c.json({ success: true, message: 'Transaction deleted successfully' }, 200)
        } catch (error) {
            console.error('Error deleting transaction:', error)
            return c.json({ error: 'Failed to delete transaction' }, 500)
        }
    }
)
app.get('/summary/:userId', 
    zValidator('param', getTransactionSummarySchema),
    async(c)=>{
        const { userId } = c.req.valid('param')
        try {
            const summary = await db
                .select({
                    category: transactionTable.category,
                    totalAmount: sum(transactionTable.amount)
                })
                .from(transactionTable)
                .where(eq(transactionTable.userId, Number(userId)))
                .groupBy(transactionTable.category)
            console.log('Transaction summary:', summary)
            if (summary.length === 0) {
                return c.json({ error: 'No transactions found for this user' }, 404)
            }
            // Return the summary of transactions grouped by category
            // total amount , income , expenses
            // const formattedSummary = {
            //     totalIncome: summary.filter(item => item.category === 'income').reduce((acc, curr) => acc + (curr?.totalAmount || 0), 0),
            //     totalExpenses: summary.filter(item => item.category === 'expense').reduce((acc, curr) => acc + (curr.totalAmount || 0), 0),
            //     categories: summary.map(item => ({
            //         category: item.category,
            //         totalAmount: item.totalAmount || 0
            //     }))
            // }

            return c.json({ "success": true, "data": summary }, 200)
        } catch (error) {
            console.error('Error fetching transaction summary:', error)
            return c.json({ error: 'Failed to fetch transaction summary' }, 500)
        }
    }
)

export default app