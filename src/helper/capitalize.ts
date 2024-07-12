const capitalize = (word: string) => {
  const firstCharacter = word[0];
  const restOfWord = word.slice(1);

  return `${firstCharacter.toUpperCase()}${restOfWord}`;
}

export {
  capitalize
}