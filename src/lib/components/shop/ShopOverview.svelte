<script lang="ts">
    import { PERK_GROUPS } from "$lib/gnome/perk";
    import type { Writable } from "svelte/store";
    import type { PerkShowcase } from ".";

    export let perkShowcase: Writable<PerkShowcase | undefined>;

</script>

<!-- TODO: ghost out perks that have been purchased -->
{#each PERK_GROUPS as group}
    <div>
        <h1 class="text-md text-lime-600">{group.name}</h1>
        <p class="text-sm text-muted-foreground">{group.description}</p>
        <div class="flex overflow-x-auto gap-x-5 mt-5">
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
                </div>
            {/each}
        </div>
    </div>
{/each}
