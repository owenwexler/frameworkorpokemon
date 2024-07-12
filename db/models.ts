import { db, eq, Items } from "astro:db";
import type { Item } from "../typedefs/Item";

const getAllItems = async (): Promise<Item[]> => {
  try {
    const items = await db.select().from(Items);
    return items;
  } catch(err) {
    console.error(err);
    throw err;
  }
}

export {
  getAllItems
}