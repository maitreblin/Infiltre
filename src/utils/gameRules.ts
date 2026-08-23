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
 * Calculate the total maximum allowed adversaries (Undercover + Mr. White)
 * Règles Undercover:
 * - Nombre PAIR (ex: 4, 6, 8): Civils >= Adversaires => Adversaires <= Total / 2
 * - Nombre IMPAIR (ex: 3, 5, 7): Civils > Adversaires => Adversaires <= floor((Total - 1) / 2)
 */
export function calculateMaxTotalAdversaries(totalPlayers: number): number {
  const isEven = totalPlayers % 2 === 0;
  if (isEven) {
    return Math.floor(totalPlayers / 2);
  } else {
    return Math.floor((totalPlayers - 1) / 2);
  }
}

/**
 * Calculate the number of civilians based on game rules
 * IMPORTANT: totalPlayers = calculatedCivils + numUndercovers + numMrWhite
 */
export function calculateCivils(
  totalPlayers: number,
  numUndercovers: number,
  numMrWhite: number
): number {
  return totalPlayers - numUndercovers - numMrWhite;
}

/**
 * Calculate maximum allowed undercovers
 * - Undercovers seuls doivent être strictement inférieurs aux Civils : U <= floor((Total - 1) / 2)
 *   (Par exemple, pour 4 joueurs : max 1 Undercover ; 2 Undercovers pour 4 joueurs n'est pas autorisé)
 * - Le total U + MW ne peut pas dépasser maxAdversaries
 */
export function calculateMaxUndercovers(
  totalPlayers: number,
  numMrWhite: number
): number {
  const maxAdversaries = calculateMaxTotalAdversaries(totalPlayers);
  const maxUndercoversLimit = Math.floor((totalPlayers - 1) / 2);

  const availableSlots = maxAdversaries - numMrWhite;
  return Math.max(0, Math.min(maxUndercoversLimit, availableSlots));
}

/**
 * Calculate maximum allowed Mr. White
 * - Le total U + MW ne peut pas dépasser maxAdversaries
 * - Dans les règles standard Undercover, Mr. White est limité (max 1 pour 3-6 joueurs, max 2 au-delà)
 */
export function calculateMaxMrWhite(
  totalPlayers: number,
  numUndercovers: number
): number {
  const maxAdversaries = calculateMaxTotalAdversaries(totalPlayers);
  const maxMrWhiteLimit = Math.max(1, Math.floor(totalPlayers / 4));

  const availableSlots = maxAdversaries - numUndercovers;
  return Math.max(0, Math.min(maxMrWhiteLimit, availableSlots));
}

/**
 * Validate the game configuration
 * Règles du jeu Undercover:
 * - Nombre PAIR de joueurs: Civils >= Undercover + Mr White (supérieur ou égal)
 * - Nombre IMPAIR de joueurs: Civils > Undercover + Mr White (strictement supérieur)
 * - Undercovers seuls: max floor((totalPlayers - 1) / 2) (ex: max 1 à 4 joueurs)
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

  const maxUndercoversLimit = Math.floor((totalPlayers - 1) / 2);
  if (numUndercovers > maxUndercoversLimit) {
    return {
      isValid: false,
      errorMessage: `Pour ${totalPlayers} joueurs, le maximum d'Undercovers est de ${maxUndercoversLimit}.`,
    };
  }

  const isEven = totalPlayers % 2 === 0;
  const adversaries = numUndercovers + numMrWhite;

  if (isEven) {
    // Nombre pair : Civils >= Undercover + Mr White
    if (calculatedCivils < adversaries) {
      return {
        isValid: false,
        errorMessage: `Nombre pair : Les Civils doivent être ≥ Adversaires (${calculatedCivils} < ${adversaries})`,
      };
    }
  } else {
    // Nombre impair : Civils > Undercover + Mr White
    if (calculatedCivils <= adversaries) {
      return {
        isValid: false,
        errorMessage: `Nombre impair : Les Civils doivent être > Adversaires (${calculatedCivils} ≤ ${adversaries})`,
      };
    }
  }

  return { isValid: true };
}
