import type { TextComponent } from "$lib/protocol/text";
import type { GnomeInstance } from "../instance";

export interface CanPurchaseResult {
    purchaseable: boolean;
    message?: string;
}

export interface Perk {
    /**
     * Optional unique name, otherwise it is inherited from the perk group.
     */
    name?: TextComponent[];
    /**
     * Optional description to this perk group's description.
     */
    description?: TextComponent[];
    /**
     * Optional description describing the cost of this perk.
     */
    costMessage?: TextComponent[];
    /**
     * Optional unique image url, otherwise it is inherited from the perk group.
     */
    imageUrl?: string;

    /**
     * A function indicating whether this perk can be purchased.
     *
     * @param instance The Gnome instance.
     * @returns A result containing whether the perk can be purchased.
     */
    canPurchase: (instance: GnomeInstance) => CanPurchaseResult;

    /**
     * A function called to purchase a perk.
     *
     * This function is responsible for the following:
     * - deducting or changing any currency value
     *
     * This function CAN assume the following:
     * - the purchase can be made (i.e., assume Perk::canPurchase has been called, unless otherwise
     * necessary)
     *
     * This function is NOT responsible for the following:
     * - logging/keeping track that this perk was purchased
     *
     * @param instance The Gnome instance.
     */
    purchase: (instance: GnomeInstance) => void;
}

/**
 * Represents a group of related perks (i.e., perks with tiers).
 */
export interface PerkGroup {
    id: string;
    name: TextComponent[];
    description: TextComponent[];
    imageUrl?: string;
    perks: Perk[];
}
