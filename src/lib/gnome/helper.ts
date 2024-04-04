/**
 * A set of helper functions which modify GnomeInstance values and automatically broadcasts updates
 * to all users if needed.
 *
 * @packageDocumentation
 */

import type { SendMessageEvent, UpdateGnomesEvent, UpdatePerksEvent } from "$lib/protocol/server";
import type { TextComponent } from "$lib/protocol/text";
import type { GnomeInstance } from "./instance";
import type { PerkGroup } from "./perk";

export function addGnomes(instance: GnomeInstance, gnomes: number) {
    instance.setGnomes(instance.getGnomes() + gnomes);

    const updateEvent: UpdateGnomesEvent = {
        gnomes: instance.getGnomes(),
    };
    instance.broadcast({
        eventType: "update-gnomes",
        payloadJson: JSON.stringify(updateEvent),
    });
}

export function removeGnomes(instance: GnomeInstance, gnomes: number) {
    instance.setGnomes(instance.getGnomes() - gnomes);

    const updateEvent: UpdateGnomesEvent = {
        gnomes: instance.getGnomes(),
    };
    instance.broadcast({
        eventType: "update-gnomes",
        payloadJson: JSON.stringify(updateEvent),
    });
}

export function sendUpdatedGnomes(instance: GnomeInstance) {
    const updateEvent: UpdateGnomesEvent = {
        gnomes: instance.getGnomes(),
    };
    instance.broadcast({
        eventType: "update-gnomes",
        payloadJson: JSON.stringify(updateEvent),
    });
}

/**
 * Adds a perk to an instance.
 *
 * @param group The perk group.
 * @param tier The zero-based tier of the perk.
 */
export function addPerk(instance: GnomeInstance, group: PerkGroup, tier: number) {
    instance.addPerk(group, tier);

    const updateEvent: UpdatePerksEvent = {
        perks: Array.from(instance.getPerks().entries()),
    };

    instance.broadcast({
        eventType: "update-perks",
        payloadJson: JSON.stringify(updateEvent),
    });
}

/**
 * Removes a perk from an instance.
 *
 * @param group The perk group.
 */
export function removePerk(instance: GnomeInstance, group: PerkGroup) {
    instance.removePerk(group);

    const updateEvent: UpdatePerksEvent = {
        perks: Array.from(instance.getPerks().entries()),
    };
    instance.broadcast({
        eventType: "update-perks",
        payloadJson: JSON.stringify(updateEvent),
    });
}

export function broadcastMessage(instance: GnomeInstance, message: TextComponent[]) {
    const event: SendMessageEvent = {
        message,
    };
    instance.broadcast({
        eventType: "send-message",
        payloadJson: JSON.stringify(event),
    });
}
