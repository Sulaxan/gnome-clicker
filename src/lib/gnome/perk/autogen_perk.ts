import type { Perk, PerkGroup } from ".";
import { removeGnomes } from "../helper";
import type { GnomeInstance } from "../instance";

export interface AutoGenPerk extends Perk {
    /**
     * A value indicating how many Gnomes the perk generates.
     */
    autoGenIncrement: number;
}

function canPurchase(instance: GnomeInstance, requiredGnomes: number): boolean {
    return instance.getGnomes() >= requiredGnomes;
}

export const AUTO_GEN_PERK_GROUP: PerkGroup = {
    id: "autogen",
    name: "Auto Gnome Generation",
    description: "Automatically generate Gnomes every second.",
    perks: [
        {
            description: "Gnomes/sec: 1",
            autoGenIncrement: 1,
            canPurchase(instance) {
                canPurchase(instance, 1000);
            },
            purchase(instance) {
                removeGnomes(instance, 1000);
            },
        },
        {
            description: "Gnomes/sec: 3",
            autoGenIncrement: 3,
            canPurchase(instance) {
                canPurchase(instance, 2500);
            },
            purchase(instance) {
                removeGnomes(instance, 2500);
            },
        },
        {
            description: "Gnomes/sec: 5",
            autoGenIncrement: 5,
            canPurchase(instance) {
                canPurchase(instance, 5000);
            },
            purchase(instance) {
                removeGnomes(instance, 5000);
            },
        },
    ] as AutoGenPerk[],
};
