import { db, Items } from 'astro:db';
import { combinedFrameworksPokemonArray } from '../data/data';

// https://astro.build/db/seed
export default async function seed() {
	const seedData = combinedFrameworksPokemonArray.map(item => { return { name: item.name, type: item.type } });

	await db.insert(Items).values(seedData);
}