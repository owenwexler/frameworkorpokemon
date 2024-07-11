const combineFrameworkPokemonArrays = (frameworks: string[], pokemon: string[]): DBSeedObject[] => {
  const maxLength = Math.max(frameworks.length, pokemon.length);
  const result: any[] = [];

  let id = 0;

  for (let i = 0; i < maxLength; i++) {
    if (i < frameworks.length) {
      result.push({ id, name: frameworks[i], type: 'framework' });
      id++;
    }
    if (i < pokemon.length) {
      result.push({ id, name: pokemon[i], type: 'pokemon' });
      id++;
    }
  }

  return result;
};

export {
  combineFrameworkPokemonArrays
}