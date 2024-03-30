<script lang="ts">
    import { PERK_GROUPS } from "$lib/gnome/perk";
    import type { Writable } from "svelte/store";
    import type { PerkShowcase } from ".";
    import Text from "../Text.svelte";

    export let perkShowcase: Writable<PerkShowcase | undefined>;
</script>

<div class="flex flex-col gap-y-3">
    <!-- TODO: ghost out perks that have been purchased -->
    {#each PERK_GROUPS as group}
        <div>
            <Text components={group.name} defaultColor="#65a30d" className="text-md" />
            <Text
                components={group.description}
                defaultColor="hsl(var(--muted-foreground))"
                className="text-sm"
            />
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
                    </div>
                {/each}
            </div>
        </div>
    {/each}
</div>
