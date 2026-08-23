import { WordPair, CustomWordPack } from '../types/game';

export type { WordPair, CustomWordPack };

export const BASE_WORD_PAIRS: WordPair[] = [
  // Boissons
  { citoyen: 'Coca', undercover: 'Pepsi', theme: 'Boissons' },
  { citoyen: 'Café', undercover: 'Thé', theme: 'Boissons' },
  { citoyen: 'Bière', undercover: 'Vin', theme: 'Boissons' },

  // Animaux
  { citoyen: 'Chat', undercover: 'Chien', theme: 'Animaux' },
  { citoyen: 'Lion', undercover: 'Tigre', theme: 'Animaux' },
  { citoyen: 'Requin', undercover: 'Baleine', theme: 'Animaux' },
  { citoyen: 'Papillon', undercover: 'Libellule', theme: 'Animaux' },

  // Transport
  { citoyen: 'Voiture', undercover: 'Moto', theme: 'Transport' },
  { citoyen: 'Avion', undercover: 'Hélicoptère', theme: 'Transport' },
  { citoyen: 'Train', undercover: 'Métro', theme: 'Transport' },
  { citoyen: 'Vélo', undercover: 'Trottinette', theme: 'Transport' },

  // Technologie
  { citoyen: 'Ordinateur', undercover: 'Tablette', theme: 'Technologie' },
  { citoyen: 'iPhone', undercover: 'Samsung', theme: 'Technologie' },
  { citoyen: 'Netflix', undercover: 'Disney+', theme: 'Technologie' },
  { citoyen: 'Instagram', undercover: 'TikTok', theme: 'Technologie' },

  // Nourriture
  { citoyen: 'Pizza', undercover: 'Burger', theme: 'Nourriture' },
  { citoyen: 'Pomme', undercover: 'Poire', theme: 'Nourriture' },
  { citoyen: 'Chocolat', undercover: 'Caramel', theme: 'Nourriture' },
  { citoyen: 'Pâtes', undercover: 'Riz', theme: 'Nourriture' },
  { citoyen: 'Croissant', undercover: 'Pain au chocolat', theme: 'Nourriture' },

  // Sports
  { citoyen: 'Football', undercover: 'Rugby', theme: 'Sports' },
  { citoyen: 'Tennis', undercover: 'Badminton', theme: 'Sports' },
  { citoyen: 'Natation', undercover: 'Plongée', theme: 'Sports' },

  // Nature
  { citoyen: 'Mer', undercover: 'Océan', theme: 'Nature' },
  { citoyen: 'Montagne', undercover: 'Colline', theme: 'Nature' },
  { citoyen: 'Forêt', undercover: 'Jungle', theme: 'Nature' },
  { citoyen: 'Soleil', undercover: 'Lune', theme: 'Nature' },

  // Vêtements
  { citoyen: 'Pantalon', undercover: 'Jean', theme: 'Vêtements' },
  { citoyen: 'Basket', undercover: 'Chaussure', theme: 'Vêtements' },
  { citoyen: 'Casquette', undercover: 'Chapeau', theme: 'Vêtements' },

  // Métiers
  { citoyen: 'Médecin', undercover: 'Infirmier', theme: 'Métiers' },
  { citoyen: 'Professeur', undercover: 'Instituteur', theme: 'Métiers' },
  { citoyen: 'Acteur', undercover: 'Comédien', theme: 'Métiers' },

  // Objets du quotidien
  { citoyen: 'Livre', undercover: 'Magazine', theme: 'Objets du quotidien' },
  { citoyen: 'Stylo', undercover: 'Crayon', theme: 'Objets du quotidien' },
  { citoyen: 'Canapé', undercover: 'Fauteuil', theme: 'Objets du quotidien' },
  { citoyen: 'Télévision', undercover: 'Écran', theme: 'Objets du quotidien' },

  // Lieux
  { citoyen: 'Restaurant', undercover: 'Café', theme: 'Lieux' },
  { citoyen: 'Cinéma', undercover: 'Théâtre', theme: 'Lieux' },
  { citoyen: 'Hôtel', undercover: 'Auberge', theme: 'Lieux' },
  { citoyen: 'École', undercover: 'Université', theme: 'Lieux' },

  // Saisons/Temps
  { citoyen: 'Été', undercover: 'Printemps', theme: 'Saisons & Temps' },
  { citoyen: 'Hiver', undercover: 'Automne', theme: 'Saisons & Temps' },
  { citoyen: 'Jour', undercover: 'Journée', theme: 'Saisons & Temps' },

  // Divertissement
  { citoyen: 'Jeu vidéo', undercover: 'Jeu de société', theme: 'Divertissement' },
  { citoyen: 'Film', undercover: 'Série', theme: 'Divertissement' },
  { citoyen: 'Roman', undercover: 'Nouvelle', theme: 'Divertissement' },

  // Personnalités fictives
  { citoyen: 'Superman', undercover: 'Batman', theme: 'Héros & Fictions' },
  { citoyen: 'Harry Potter', undercover: 'Hermione', theme: 'Héros & Fictions' },
  { citoyen: 'Spider-Man', undercover: 'Iron Man', theme: 'Héros & Fictions' },
];

export const WORD_PAIRS = BASE_WORD_PAIRS;

const STORAGE_KEY = 'infiltre_custom_word_packs';

/**
 * Charge les packs personnalisés depuis le localStorage
 */
export const getCustomPacks = (): CustomWordPack[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (err) {
    console.error('Erreur lecture custom packs localStorage:', err);
    return [];
  }
};

/**
 * Sauvegarde les packs personnalisés dans le localStorage
 */
export const saveCustomPacks = (packs: CustomWordPack[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(packs));
  } catch (err) {
    console.error('Erreur écriture custom packs localStorage:', err);
  }
};

/**
 * Ajoute un pack personnalisé
 */
export const addCustomPack = (theme: string, pairs: WordPair[]): CustomWordPack => {
  const packs = getCustomPacks();
  const cleanTheme = theme.trim() || 'Personnalisé';
  const newPack: CustomWordPack = {
    id: 'pack_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    theme: cleanTheme,
    pairs: pairs.map((p) => ({
      citoyen: p.citoyen.trim(),
      undercover: p.undercover.trim(),
      theme: cleanTheme,
    })),
    createdAt: Date.now(),
  };

  packs.push(newPack);
  saveCustomPacks(packs);
  return newPack;
};

/**
 * Supprime un pack personnalisé
 */
export const deleteCustomPack = (packId: string): void => {
  const packs = getCustomPacks().filter((p) => p.id !== packId);
  saveCustomPacks(packs);
};

/**
 * Supprime une paire d'un pack personnalisé
 */
export const deletePairFromPack = (packId: string, pairIndex: number): void => {
  const packs = getCustomPacks();
  const pack = packs.find((p) => p.id === packId);
  if (pack) {
    pack.pairs.splice(pairIndex, 1);
    if (pack.pairs.length === 0) {
      saveCustomPacks(packs.filter((p) => p.id !== packId));
    } else {
      saveCustomPacks(packs);
    }
  }
};

/**
 * Ajoute une paire manuelle à un thème
 */
export const addManualPair = (theme: string, citoyen: string, undercover: string): void => {
  const cleanTheme = theme.trim() || 'Personnalisé';
  const packs = getCustomPacks();
  let existingPack = packs.find((p) => p.theme.toLowerCase() === cleanTheme.toLowerCase());

  const newPair: WordPair = {
    citoyen: citoyen.trim(),
    undercover: undercover.trim(),
    theme: cleanTheme,
  };

  if (existingPack) {
    existingPack.pairs.push(newPair);
  } else {
    packs.push({
      id: 'pack_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      theme: cleanTheme,
      pairs: [newPair],
      createdAt: Date.now(),
    });
  }

  saveCustomPacks(packs);
};

/**
 * Réinitialise tous les mots personnalisés
 */
export const clearAllCustomPacks = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

/**
 * Récupère la liste de tous les thèmes disponibles avec le nombre de mots
 */
export const getAllAvailableThemes = (): { id: string; name: string; count: number }[] => {
  const customPacks = getCustomPacks();
  const totalCustomPairs = customPacks.reduce((acc, p) => acc + p.pairs.length, 0);
  const totalAllPairs = BASE_WORD_PAIRS.length + totalCustomPairs;

  const list: { id: string; name: string; count: number }[] = [
    { id: 'ALL', name: '🎲 Tous les thèmes', count: totalAllPairs },
    { id: 'BASE', name: '📦 Mots de base', count: BASE_WORD_PAIRS.length },
  ];

  // Regrouper par nom de thème personnalisé
  const themeMap = new Map<string, { id: string; name: string; count: number }>();
  for (const pack of customPacks) {
    const existing = themeMap.get(pack.theme);
    if (existing) {
      existing.count += pack.pairs.length;
    } else {
      themeMap.set(pack.theme, {
        id: 'THEME_' + pack.theme,
        name: `🏷️ ${pack.theme}`,
        count: pack.pairs.length,
      });
    }
  }

  themeMap.forEach((val) => list.push(val));
  return list;
};

/**
 * Sélectionne une paire de mots aléatoirement selon le thème choisi
 */
export const getRandomWordPair = (themeId: string = 'ALL'): WordPair => {
  const customPacks = getCustomPacks();
  let pool: WordPair[] = [];

  if (themeId === 'BASE') {
    pool = [...BASE_WORD_PAIRS];
  } else if (themeId.startsWith('THEME_')) {
    const targetTheme = themeId.replace('THEME_', '');
    const matchingPacks = customPacks.filter(
      (p) => p.theme.toLowerCase() === targetTheme.toLowerCase()
    );
    for (const p of matchingPacks) {
      pool.push(...p.pairs);
    }
    // Si pour une raison quelconque le pool est vide, fallback sur base
    if (pool.length === 0) {
      pool = [...BASE_WORD_PAIRS];
    }
  } else {
    // 'ALL' -> Tous les mots de base + tous les mots personnalisés
    pool = [...BASE_WORD_PAIRS];
    for (const p of customPacks) {
      pool.push(...p.pairs);
    }
  }

  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
};

/**
 * Décode UTF-8 Base64
 */
export function decodeBase64Utf8(base64: string): string {
  const cleanBase64 = base64.trim().replace(/\s+/g, '');
  const binaryString = atob(cleanBase64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return new TextDecoder('utf-8').decode(bytes);
}

/**
 * Encode UTF-8 Base64
 */
export function encodeBase64Utf8(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Décode et valide le payload généré par l'IA
 */
export function decodeEncryptedPack(rawInput: string): { theme: string; pairs: WordPair[] } {
  let base64String = rawInput.trim();

  // Extraire après CODE_INFILTRE: si présent
  const prefixMatch = base64String.match(/CODE_INFILTRE\s*:\s*([A-Za-z0-9+/=]+)/i);
  if (prefixMatch && prefixMatch[1]) {
    base64String = prefixMatch[1].trim();
  } else {
    // Ou extraire le plus long bloc base64 valide
    const blockMatch = base64String.match(/[A-Za-z0-9+/=]{16,}/);
    if (blockMatch) {
      base64String = blockMatch[0].trim();
    }
  }

  const jsonStr = decodeBase64Utf8(base64String);
  const data = JSON.parse(jsonStr);

  if (!data || !Array.isArray(data.pairs) || data.pairs.length === 0) {
    throw new Error('Format de données invalide : aucune paire de mots trouvée.');
  }

  const themeName = data.theme && typeof data.theme === 'string' ? data.theme.trim() : 'Personnalisé';

  const validatedPairs: WordPair[] = data.pairs
    .filter((p: any) => p && typeof p.citoyen === 'string' && typeof p.undercover === 'string')
    .map((p: any) => ({
      citoyen: p.citoyen.trim(),
      undercover: p.undercover.trim(),
      theme: themeName,
    }));

  if (validatedPairs.length === 0) {
    throw new Error('Aucune paire valide (citoyen/undercover) trouvée.');
  }

  return {
    theme: themeName,
    pairs: validatedPairs,
  };
}

/**
 * Génère le prompt prêt à être copié pour l'IA
 */
export function generateAIPrompt(count: number, theme: string): string {
  const chosenTheme = theme.trim() || 'Général & Pop-Culture';
  const numPairs = count > 0 ? count : 10;

  return `Tu es un expert du jeu de société "Undercover" (aussi appelé "L'Infiltré").

Ta mission : Générer ${numPairs} paires de mots secrets pour le jeu sur le thème suivant : "${chosenTheme}".

Règles de qualité pour les paires de mots :
1. Dans chaque paire, le mot "citoyen" et le mot "undercover" doivent être très proches et appartenir au même univers (ex: "Popcorn" et "Nachos", "Harry Potter" et "Le Seigneur des Anneaux", "Acteur" et "Doubleur").
2. Les deux mots doivent être suffisamment similaires pour que les joueurs puissent donner des indices ambigus, mais distincts.
3. Les mots doivent être en français, clairs et sans fautes.

⚠️ RÈGLE ANTI-SPOIL ABSOLUE :
Pour ne pas gâcher la surprise au joueur qui va copier ta réponse, tu ne dois JAMAIS afficher les mots en clair dans ton message.
Tu dois :
1. Formater les données au format JSON :
{
  "theme": "${chosenTheme}",
  "pairs": [
    { "citoyen": "MotCitoyen1", "undercover": "MotUndercover1" },
    { "citoyen": "MotCitoyen2", "undercover": "MotUndercover2" }
  ]
}
2. Encoder TOUT ce JSON en Base64 (UTF-8).
3. Répondre STRICTEMENT et UNIQUEMENT avec le code généré sous cette forme, sans aucune formule de politesse ni texte avant/après :

CODE_INFILTRE: [colle ici la chaîne Base64]`;
}
