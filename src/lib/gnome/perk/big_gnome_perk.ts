import { TextBuilder } from "$lib/protocol/text";
import type { Perk, PerkGroup } from ".";
import { removeGnomes } from "../helper";
import { checkRequiredGnomes, gnomeCostMessage } from "./helper";

export interface BigGnomePerk extends Perk {
    /**
     * Value indicating how many gnomes the user gets per click.
     */
    gnomesPerClick: number;
}

const TIER_1_COST = 1000;
const TIER_2_COST = 5000;
const TIER_3_COST = 10000;
const TIER_4_COST = 15000;

export const BIG_GNOME_PERK_GROUP: PerkGroup = {
    id: "big-gnome",
    name: TextBuilder.of("Big Gnome").build(),
    description: TextBuilder.of("Get more Gnomes per click").build(),
    perks: [
        {
            description: TextBuilder.of("Gnomes/click: 2").build(),
            gnomesPerClick: 2,
            costMessage: gnomeCostMessage(TIER_1_COST),
            canPurchase(instance) {
                return checkRequiredGnomes(instance, TIER_1_COST);
            },
            purchase(instance) {
                removeGnomes(instance, TIER_1_COST);
            },
        },
        {
            description: TextBuilder.of("Gnomes/click: 3").build(),
            gnomesPerClick: 3,
            costMessage: gnomeCostMessage(TIER_2_COST),
            canPurchase(instance) {
                return checkRequiredGnomes(instance, TIER_2_COST);
            },
            purchase(instance) {
                removeGnomes(instance, TIER_2_COST);
            },
        },
        {
            description: TextBuilder.of("Gnomes/click: 4").build(),
            gnomesPerClick: 4,
            costMessage: gnomeCostMessage(TIER_3_COST),
            canPurchase(instance) {
                return checkRequiredGnomes(instance, TIER_3_COST);
            },
            purchase(instance) {
                removeGnomes(instance, TIER_3_COST);
            },
        },
        {
            description: TextBuilder.of("Gnomes/click: 5").build(),
            gnomesPerClick: 5,
            costMessage: gnomeCostMessage(TIER_4_COST),
            canPurchase(instance) {
                return checkRequiredGnomes(instance, TIER_4_COST);
            },
            purchase(instance) {
                removeGnomes(instance, TIER_4_COST);
            },
        },
    ] as BigGnomePerk[],
};
