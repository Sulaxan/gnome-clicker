import type { Perk } from ".";
import type { PerkGroup } from ".";
import { AUTO_GEN_PERK_GROUP } from "./autogen_perk";

export * from "./perk";
export * from "./autogen_perk";

export const PERK_GROUPS: PerkGroup[] = [AUTO_GEN_PERK_GROUP];

/**
 * Gets a perk group by its id.
 *
 * @param id The id of the perk group.
 * @returns The associated PerkGroup, or undefined if the perk group does not exist.
 */
export function getPerkGroup(id: string): PerkGroup | undefined {
    return PERK_GROUPS.find((group) => group.id === id);
}

/**
 * Returns the given perk tier for a perk group.
 *
 * @param group The perk group.
 * @param tier The zero-indexed tier.
 * @returns The associated Perk, or undefined if the tier does not exist.
 */
export function getPerkTier(group: PerkGroup, tier: number): Perk | undefined {
    return group.perks.at(tier);
}
