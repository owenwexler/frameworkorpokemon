import type { Item } from "../../typedefs/Item";

const getIsAText = (item: Item) => {
  return `${item.name} is a ${item.type === 'pokemon' ? 'Pokemon' : 'framework'}`;
}

export {
  getIsAText
}