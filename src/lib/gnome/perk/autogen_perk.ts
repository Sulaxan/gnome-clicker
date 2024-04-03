import { TextBuilder } from "$lib/protocol/text";
import type { Perk, PerkGroup } from ".";
import { removeGnomes } from "../helper";
import { checkRequiredGnomes, gnomeCostMessage } from "./helper";

export interface AutoGenPerk extends Perk {
    /**
     * A value indicating how many Gnomes the perk generates.
     */
    autoGenIncrement: number;
}

const TIER_1_COST = 1000;
const TIER_2_COST = 2500;
const TIER_3_COST = 5000;

export const AUTO_GEN_PERK_GROUP: PerkGroup = {
    id: "autogen",
    name: TextBuilder.of("Auto Gnome Generation").build(),
    description: TextBuilder.of("Automatically generate Gnomes every second.").build(),
    perks: [
        {
            description: TextBuilder.of("Gnomes/sec: 1").build(),
            costMessage: gnomeCostMessage(TIER_1_COST),
            imageUrl: "/perk/autogen/autogen_1.png",
            autoGenIncrement: 1,
            canPurchase(instance) {
                return checkRequiredGnomes(instance, TIER_1_COST);
            },
            purchase(instance) {
                removeGnomes(instance, TIER_1_COST);
            },
        },
        {
            description: TextBuilder.of("Gnomes/sec: 3").build(),
            costMessage: gnomeCostMessage(TIER_2_COST),
            imageUrl: "/perk/autogen/autogen_2.png",
            autoGenIncrement: 3,
            canPurchase(instance) {
                return checkRequiredGnomes(instance, TIER_2_COST);
            },
            purchase(instance) {
                removeGnomes(instance, TIER_2_COST);
            },
        },
        {
            description: TextBuilder.of("Gnomes/sec: 5").build(),
            costMessage: gnomeCostMessage(TIER_3_COST),
            imageUrl: "/perk/autogen/autogen_3.png",
            autoGenIncrement: 5,
            canPurchase(instance) {
                return checkRequiredGnomes(instance, TIER_3_COST);
            },
            purchase(instance) {
                removeGnomes(instance, TIER_3_COST);
            },
        },
    ] as AutoGenPerk[],

    activate(instance, tier) {
        if (tier >= this.perks.length) {
            return;
        }

        const gnomes = (this.perks[tier] as AutoGenPerk).autoGenIncrement;
        instance.setGnomes(instance.getGnomes() + gnomes);
    },
};
