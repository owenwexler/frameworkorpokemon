import { db } from "./db";
import type { Item } from "../typedefs/Item";
import { items } from "./schema";

const getAllItems = async (): Promise<Item[]> => {
  try {
    const result = await db.select().from(items);
    return result as Item[];
  } catch(err) {
    console.error(err);
    throw err;
  }
}

export {
  getAllItems
}