import { Hono } from 'hono';
import { transactionTable } from '../db/transaction';
import { zValidator } from '@hono/zod-validator';
import { db } from "../index"
import { z } from '@hono/zod-openapi';
import { eq, sum } from "drizzle-orm";

const app = new Hono();


const createTransactionSchema = z.object({
    userId: z.string(),
    title: z.string(),
    amount: z.number(),
    category: z.string(),
    isExpense: z.boolean()
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
            const { userId, title, amount, category, isExpense } = c.req.valid('json')
            const result = await db.insert(transactionTable).values({
                userId,
                title,
                amount,
                category,
                type: isExpense ? "Expense" : "Income"
            })
            return c.json({ "success": true, "message": "Transaction created successfully" }, 201)
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
        console.log("get transaction")
        try {
            const transactions = await db.select().from(transactionTable).where(eq(transactionTable.userId, userId))
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
            // console.log('Delete result:', result)
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
    async (c) => {
        console.log("get transactionm summary")
        const { userId } = c.req.valid('param')
        try {
            const summary = await db
                .select({
                    category: transactionTable.type,
                    totalAmount: sum(transactionTable.amount)
                })
                .from(transactionTable)
                .where(eq(transactionTable.userId, userId))
                .groupBy(transactionTable.type)
            if (summary.length === 0) return c.json({ sucees: true, message: 'No transactions found for this user' })
            const income = summary.find(item => item.category === 'Income');
            const expense = summary.find(item => item.category === 'Expense');

            const res = {
                Income: income?.totalAmount || "0",
                Expense: expense?.totalAmount || "0",
                total: parseFloat(income?.totalAmount || "0") - parseFloat(expense?.totalAmount || "0"),
            };

            return c.json({ "success": true, "data": res }, 200)
        } catch (error) {
            console.error('Error fetching transaction summary:', error)
            return c.json({ error: 'Failed to fetch transaction summary' }, 500)
        }
    }
)

export default app