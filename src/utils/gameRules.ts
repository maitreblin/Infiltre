/**
 * Game rules utilities for configuration validation
 */

export interface RoleConstraints {
  numCivils: number;
  maxUndercovers: number;
  maxMrWhite: number;
  isValid: boolean;
  errorMessage?: string;
}

/**
 * Calculate the number of civilians based on game rules
 * IMPORTANT: totalPlayers is the REAL total. This function calculates how many Civils
 * there should be such that: totalPlayers = calculatedCivils + numUndercovers + numMrWhite
 */
export function calculateCivils(
  totalPlayers: number,
  numUndercovers: number,
  numMrWhite: number
): number {
  // Le nombre de Civils est toujours: Total - Adversaires
  return totalPlayers - numUndercovers - numMrWhite;
}

/**
 * Calculate maximum allowed undercovers
 * Règles:
 * - Nombre PAIR: Civils >= U + MW donc U + MW <= Civils donc U <= Total - MW
 * - Nombre IMPAIR: Civils > U + MW donc U + MW < Civils donc U + MW <= floor(Total/2)
 */
export function calculateMaxUndercovers(
  totalPlayers: number,
  numMrWhite: number
): number {
  const isEven = totalPlayers % 2 === 0;

  if (isEven) {
    // Pair: U + MW <= Total donc U <= Total - MW (en gardant au moins 1 Civil)
    return Math.max(0, totalPlayers - numMrWhite - 1);
  } else {
    // Impair: U + MW < Civils donc U + MW <= floor(Total/2)
    const maxAdversaries = Math.floor(totalPlayers / 2);
    return Math.max(0, maxAdversaries - numMrWhite);
  }
}

/**
 * Calculate maximum allowed Mr. White
 * Règles:
 * - Nombre PAIR: Civils >= U + MW donc MW <= Total - U
 * - Nombre IMPAIR: Civils > U + MW donc MW <= floor(Total/2) - U
 */
export function calculateMaxMrWhite(
  totalPlayers: number,
  numUndercovers: number
): number {
  const isEven = totalPlayers % 2 === 0;

  if (isEven) {
    // Pair: U + MW <= Total donc MW <= Total - U (en gardant au moins 1 Civil)
    return Math.max(0, totalPlayers - numUndercovers - 1);
  } else {
    // Impair: U + MW < Civils donc U + MW <= floor(Total/2)
    const maxAdversaries = Math.floor(totalPlayers / 2);
    return Math.max(0, maxAdversaries - numUndercovers);
  }
}

/**
 * Validate the game configuration
 * Règles du jeu Undercover:
 * - Nombre PAIR de joueurs: Civils >= Undercover + Mr White (supérieur ou égal)
 * - Nombre IMPAIR de joueurs: Civils > Undercover + Mr White (strictement supérieur)
 */
export function validateConfiguration(
  totalPlayers: number,
  numUndercovers: number,
  numMrWhite: number,
  calculatedCivils: number
): { isValid: boolean; errorMessage?: string } {
  if (calculatedCivils < 1) {
    return { isValid: false, errorMessage: 'Il doit y avoir au moins 1 Civil.' };
  }

  if (numUndercovers === 0 && numMrWhite === 0) {
    return {
      isValid: false,
      errorMessage: 'Il doit y avoir au moins 1 Undercover OU 1 Mr White.',
    };
  }

  const isEven = totalPlayers % 2 === 0;
  const adversaries = numUndercovers + numMrWhite;

  if (isEven) {
    // Nombre pair : Civils >= Undercover + Mr White
    if (calculatedCivils < adversaries) {
      return {
        isValid: false,
        errorMessage: `Nombre pair: Civils doit être ≥ Undercover + Mr White (${calculatedCivils} < ${adversaries})`,
      };
    }
  } else {
    // Nombre impair : Civils > Undercover + Mr White
    if (calculatedCivils <= adversaries) {
      return {
        isValid: false,
        errorMessage: `Nombre impair: Civils doit être > Undercover + Mr White (${calculatedCivils} ≤ ${adversaries})`,
      };
    }
  }

  return { isValid: true };
}
