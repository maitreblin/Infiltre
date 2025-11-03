/**
 * Base de données des paires de mots
 * Format : [motCitoyen, motUndercover]
 */
export interface WordPair {
  citoyen: string;
  undercover: string;
}

export const WORD_PAIRS: WordPair[] = [
  { citoyen: 'Coca', undercover: 'Pepsi' },
  { citoyen: 'Chat', undercover: 'Chien' },
  { citoyen: 'Voiture', undercover: 'Moto' },
];

/**
 * Sélectionne une paire de mots aléatoirement
 */
export const getRandomWordPair = (): WordPair => {
  const randomIndex = Math.floor(Math.random() * WORD_PAIRS.length);
  return WORD_PAIRS[randomIndex];
};

