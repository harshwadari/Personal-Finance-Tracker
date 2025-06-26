import {integer, numeric, pgTable, serial, varchar} from "drizzle-orm/pg-core";

export const Budgets = pgTable('budgets', {
    id: serial('id').primaryKey(),
    name: varchar('name').notNull(),
    amount: varchar('amount').notNull(),
    icon: varchar('icon'),
    createdBy: varchar('createdBy').notNull()
});

export const Expenses = pgTable('expenses', {
    id: serial('id').primaryKey(),
    name: varchar('name').notNull(),
    amount: numeric('amount').notNull().default(0),
    budgetId: integer('budgetId').references(() => Budgets.id),
    createdAt: varchar('createdAt').notNull()
});

export const Incomes = pgTable("incomes", {
    id: serial("id").primaryKey(),
    name: varchar("name").notNull(),
    amount: varchar("amount").notNull(),
    frequency: varchar("frequency").default("monthly"),
    icon: varchar("icon"),
    createdBy: varchar("createdBy").notNull(),
    createdAt: varchar("createdAt").default(() => new Date().toISOString())
});