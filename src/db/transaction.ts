import { pgEnum, pgTable as table } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";

export const transactionType = pgEnum('type', ['Income', 'Expense']);
export const transactionTable = table("transactions", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: t.varchar().notNull(),
  title: t.varchar().notNull(),
  amount: t.integer().notNull(),
  type: transactionType(),
  category: t.varchar().notNull(),
  createdAt: t.timestamp().defaultNow().notNull(),
});
