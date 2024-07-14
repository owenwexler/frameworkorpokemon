import { sql } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const items = sqliteTable('items', {
  id: integer('item_id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text('item_name'),
  type: text('item_type')
});

export type ItemResponse = typeof items.$inferSelect;
