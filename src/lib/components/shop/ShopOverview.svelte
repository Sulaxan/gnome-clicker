<script lang="ts">
    import { PERK_GROUPS } from "$lib/gnome/perk";
    import type { Writable } from "svelte/store";
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
            <Text components={group.name} defaultColor="#65a30d" className="text-lg" />
            <Text
                components={group.description}
                defaultColor="hsl(var(--muted-foreground))"
                className="text-lg"
            />
            <div class="text-md text-muted-foreground mt-2">
                Current Tier:
                {#if perkTier !== undefined}
                    {perkTier + 1}
                {:else}
                    None
                {/if}
            </div>

            <div class="flex justify-center sm:justify-start">
                <PurchaseButton {group} />
            </div>

            <div class="flex overflow-x-auto gap-x-5 mt-3 w-full pb-3">
                {#each group.perks as perk, index}
                    <div class="flex flex-col items-center min-w-32">
                        {#if perk.imageUrl !== undefined}
                            <img class="w-32 h-32" src={perk.imageUrl} alt="Perk" />
                        {:else if group.imageUrl !== undefined}
                            <img class="w-32 h-32" src={group.imageUrl} alt="Perk" />
                        {:else}
                            <div class="w-32 h-32 bg-gray-600"></div>
                        {/if}
                        <div>Tier {index + 1}</div>
                        <button
                            class="gc-border px-3 py-1"
                            on:click={() => ($perkShowcase = { group: group, tier: index })}
                        >
                            More Info
                        </button>
                        {#if perkTier !== undefined && perkTier >= index}
                            <div class="text-md uppercase font-bold text-lime-600">Purchased</div>
                        {/if}
                    </div>
                {/each}
            </div>

            <div class="h-[1px] w-full bg-primary my-3" />
        </div>
    {/each}
</div>
