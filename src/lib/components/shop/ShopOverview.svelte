<script lang="ts">
    import { PERK_GROUPS } from "$lib/gnome/perk";
    import type { Writable, get } from "svelte/store";
    import type { PerkShowcase } from ".";
    import Text from "../Text.svelte";
    import { perks } from "$lib/stores";
    import PurchaseButton from "./PurchaseButton.svelte";

    export let perkShowcase: Writable<PerkShowcase | undefined>;
</script>

<div class="flex flex-col gap-y-1">
    <!-- TODO: ghost out perks that have been purchased -->
    {#each PERK_GROUPS as group}
        {@const perkTier = $perks.get(group.id)}
        <div>
            <Text components={group.name} defaultColor="#65a30d" className="text-md" />
            <Text
                components={group.description}
                defaultColor="hsl(var(--muted-foreground))"
                className="text-sm"
            />
            <div class="text-sm text-muted-foreground">
                Current Tier:
                {#if perkTier !== undefined}
                    {perkTier + 1}
                {:else}
                    None
                {/if}
            </div>

            <PurchaseButton {group} />

            <div class="flex overflow-x-auto gap-x-5 mt-3">
                {#each group.perks as _perk, index}
                    <div class="flex flex-col items-center">
                        <div class="w-32 h-32 bg-gray-600"></div>
                        <div>Tier {index + 1}</div>
                        <button
                            class="border rounded-lg border-primary px-3 py-1"
                            on:click={() => ($perkShowcase = { group: group, tier: index })}
                        >
                            More Info
                        </button>
                        {#if perkTier !== undefined && perkTier >= index}
                            <div class="class-sm uppercase font-bold text-lime-600">Purchased</div>
                        {/if}
                    </div>
                {/each}
            </div>

            <div class="h-[1px] w-full bg-primary my-5" />
        </div>
    {/each}
</div>
