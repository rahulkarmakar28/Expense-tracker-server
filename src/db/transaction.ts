import { pgEnum, pgTable as table } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";

export const transactionTable = table("transactions", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: t.integer().notNull(),
  title: t.varchar().notNull(),
  amount: t.integer().notNull(),
  category: t.varchar().notNull(),
  createdAt: t.timestamp().defaultNow().notNull(),
});
