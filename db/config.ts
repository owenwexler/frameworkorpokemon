import { defineDb, defineTable, column } from 'astro:db';

const Items = defineTable({
  columns: {
    id: column.number({ unique: true, primaryKey: true }),
    name: column.text(),
    type: column.text(),
  }
})

// https://astro.build/db/config
export default defineDb({
  tables: { Items }
});
