import { customers } from '@/db/schema';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';


export const insertCustomerSchema = createInsertSchema(customers, {
    firstName: (schema) => schema.min(1, "First name is required"),
    lastName: (schema) => schema.min(1, "Last name is required"),
    address1: (schema) => schema.min(1, "Address is required"),
    city: (schema) => schema.min(1, "City is required"),
    state: (schema) => schema.length(3, "State must be exactly 3 characters"),
    email: (schema) => schema.email("Invalid email address"),
    zip: (schema) => schema.regex(/^\d{5}(-\d{4})?$/, "Invalid zip code. Use 5 digits or 5 digits followed by a hyphen and 4 digits."),
    phone: (schema) => schema.regex(/^\d{3}-\d{7}$/, "Invalid phone number format. Use XXX-XXXXXXX"),
})

export const selectCustomerSchema = createSelectSchema(customers)

export type insertCustomerSchemaType = typeof insertCustomerSchema._type

export type selectCustomerSchemaType = typeof selectCustomerSchema._type