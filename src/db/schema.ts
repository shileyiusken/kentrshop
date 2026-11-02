import {
  boolean,
  integer,
  jsonb,
  pgTable,
  index,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  email: varchar("email").unique().notNull(),
  phone: varchar("phone").unique().notNull(),
  address1: varchar("address1").notNull(),
  address2: varchar("address2"),
  city: varchar("city").notNull(),
  state: varchar("state", { length: 3 }).notNull(),
  zip: varchar("zip", { length: 10 }).notNull(),
  notes: text("notes"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const tickets = pgTable("tickets", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id")
    .notNull()
    .references(() => customers.id),
  title: varchar("title").notNull(),
  description: varchar("description"),
  completed: boolean("completed").notNull().default(false),
  tech: varchar("tech").notNull().default("unassigned"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  actorId: varchar("actor_id"),
  actorEmail: varchar("actor_email").notNull(),
  action: varchar("action", { length: 20 }).notNull(),
  entityType: varchar("entity_type", { length: 20 }).notNull(),
  entityId: integer("entity_id").notNull(),
  summary: varchar("summary").notNull(),
  changes: jsonb("changes").$type<Record<string, { before: unknown; after: unknown }>>().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("audit_logs_created_at_idx").on(table.createdAt),
  index("audit_logs_entity_idx").on(table.entityType, table.entityId),
]);

export const staffRoles = pgTable("staff_roles", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  email: varchar("email").notNull(),
  role: varchar("role", { length: 20 }).$type<"manager" | "technician">().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => [
  uniqueIndex("staff_roles_user_id_unique").on(table.userId),
  index("staff_roles_role_idx").on(table.role),
]);

export const customersRelations = relations(customers, ({ many }) => ({
  tickets: many(tickets),
}));

export const ticketsRelations = relations(tickets, ({ one }) => ({
  customer: one(customers, {
    fields: [tickets.customerId],
    references: [customers.id],
  }),
}));
