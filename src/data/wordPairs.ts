/**
 * Base de données des paires de mots
 * Format : [motCitoyen, motUndercover]
 */
export interface WordPair {
  citoyen: string;
  undercover: string;
}

export const WORD_PAIRS: WordPair[] = [
  // Boissons
  { citoyen: 'Coca', undercover: 'Pepsi' },
  { citoyen: 'Café', undercover: 'Thé' },
  { citoyen: 'Bière', undercover: 'Vin' },

  // Animaux
  { citoyen: 'Chat', undercover: 'Chien' },
  { citoyen: 'Lion', undercover: 'Tigre' },
  { citoyen: 'Requin', undercover: 'Baleine' },
  { citoyen: 'Papillon', undercover: 'Libellule' },

  // Transport
  { citoyen: 'Voiture', undercover: 'Moto' },
  { citoyen: 'Avion', undercover: 'Hélicoptère' },
  { citoyen: 'Train', undercover: 'Métro' },
  { citoyen: 'Vélo', undercover: 'Trottinette' },

  // Technologie
  { citoyen: 'Ordinateur', undercover: 'Tablette' },
  { citoyen: 'iPhone', undercover: 'Samsung' },
  { citoyen: 'Netflix', undercover: 'Disney+' },
  { citoyen: 'Instagram', undercover: 'TikTok' },

  // Nourriture
  { citoyen: 'Pizza', undercover: 'Burger' },
  { citoyen: 'Pomme', undercover: 'Poire' },
  { citoyen: 'Chocolat', undercover: 'Caramel' },
  { citoyen: 'Pâtes', undercover: 'Riz' },
  { citoyen: 'Croissant', undercover: 'Pain au chocolat' },

  // Sports
  { citoyen: 'Football', undercover: 'Rugby' },
  { citoyen: 'Tennis', undercover: 'Badminton' },
  { citoyen: 'Natation', undercover: 'Plongée' },

  // Nature
  { citoyen: 'Mer', undercover: 'Océan' },
  { citoyen: 'Montagne', undercover: 'Colline' },
  { citoyen: 'Forêt', undercover: 'Jungle' },
  { citoyen: 'Soleil', undercover: 'Lune' },

  // Vêtements
  { citoyen: 'Pantalon', undercover: 'Jean' },
  { citoyen: 'Basket', undercover: 'Chaussure' },
  { citoyen: 'Casquette', undercover: 'Chapeau' },

  // Métiers
  { citoyen: 'Médecin', undercover: 'Infirmier' },
  { citoyen: 'Professeur', undercover: 'Instituteur' },
  { citoyen: 'Acteur', undercover: 'Comédien' },

  // Objets du quotidien
  { citoyen: 'Livre', undercover: 'Magazine' },
  { citoyen: 'Stylo', undercover: 'Crayon' },
  { citoyen: 'Canapé', undercover: 'Fauteuil' },
  { citoyen: 'Télévision', undercover: 'Écran' },

  // Lieux
  { citoyen: 'Restaurant', undercover: 'Café' },
  { citoyen: 'Cinéma', undercover: 'Théâtre' },
  { citoyen: 'Hôtel', undercover: 'Auberge' },
  { citoyen: 'École', undercover: 'Université' },

  // Saisons/Temps
  { citoyen: 'Été', undercover: 'Printemps' },
  { citoyen: 'Hiver', undercover: 'Automne' },
  { citoyen: 'Jour', undercover: 'Journée' },

  // Divertissement
  { citoyen: 'Jeu vidéo', undercover: 'Jeu de société' },
  { citoyen: 'Film', undercover: 'Série' },
  { citoyen: 'Roman', undercover: 'Nouvelle' },

  // Personnalités fictives
  { citoyen: 'Superman', undercover: 'Batman' },
  { citoyen: 'Harry Potter', undercover: 'Hermione' },
  { citoyen: 'Spider-Man', undercover: 'Iron Man' },
];

/**
 * Sélectionne une paire de mots aléatoirement
 */
export const getRandomWordPair = (): WordPair => {
  const randomIndex = Math.floor(Math.random() * WORD_PAIRS.length);
  return WORD_PAIRS[randomIndex];
};

