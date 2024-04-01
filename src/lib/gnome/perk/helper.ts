import { TextBuilder, type TextComponent } from "$lib/protocol/text";
import type { CanPurchaseResult } from ".";
import type { GnomeInstance } from "../instance";

export function gnomeCostMessage(requiredGnomes: number): TextComponent[] {
    return TextBuilder.new()
        .text(requiredGnomes.toString())
        .space()
        .text("Gnomes")
        .color("#fbbf24")
        .build();
}

export function checkRequiredGnomes(
    instance: GnomeInstance,
    requiredGnomes: number
): CanPurchaseResult {
    const purchaseable = instance.getGnomes() >= requiredGnomes;
    return {
        purchaseable: purchaseable,
        message: !purchaseable ? "Not enough gnomes" : "",
    };
}
