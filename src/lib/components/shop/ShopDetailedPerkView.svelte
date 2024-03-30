<script lang="ts">
    import type { Writable } from "svelte/store";
    import type { PerkShowcase } from ".";
    import type { Perk } from "$lib/gnome/perk";
    import Text from "../Text.svelte";

    export let perkShowcase: Writable<PerkShowcase | undefined>;

    let perk: Perk | undefined = $perkShowcase?.group.perks[$perkShowcase.tier];
</script>

<div>
    <button
        class="border rounded-lg border-primary px-3 py-1 mb-5"
        on:click={() => ($perkShowcase = undefined)}
    >
        Go Back
    </button>

    {#if $perkShowcase !== undefined && perk !== undefined}
        <div class="flex gap-x-1">
            <Text components={$perkShowcase.group.name} defaultColor="#65a30d" />
            <div class="text-md text-muted-foreground">(Tier {$perkShowcase.tier + 1})</div>
        </div>
        <Text
            components={$perkShowcase.group.description}
            defaultColor="hsl(var(--muted-foreground))"
            className="text-sm"
        />

        <div class="mt-5">
            {#if perk.name !== undefined}
                <Text components={perk.name} className="text-md" />
            {/if}
            {#if perk.description !== undefined}
                <Text components={perk.description} className="text-sm" />
            {/if}
        </div>

        <div class="mt-5">
            {#if perk.costMessage !== undefined}
                <div class="text-sm font-bold">Cost:</div>
                <Text components={perk.costMessage} className="text-sm" />
            {/if}
        </div>

        <button
            class="text-md text-lime-600 px-3 py-1 mt-5 uppercase border rounded-lg border-lime-600"
        >
            Purchase
        </button>
    {:else}
        <div class="text-sm text-red-600">An error occurred</div>
    {/if}

    <!-- TODO: Add purchase button -->
</div>
