<script lang="ts">
    import type { Writable } from "svelte/store";
    import type { PerkShowcase } from ".";
    import type { Perk } from "$lib/gnome/perk";

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
        <div class="text-md text-lime-600">{$perkShowcase.group.name}</div>
        <div class="text-sm mb-5">{$perkShowcase.group.description}</div>

        <div class="text-sm text-muted-foreground">Tier: {$perkShowcase.tier + 1}</div>
        <div class="text-sm text-muted-foreground">{perk.name || ""}</div>
        <div class="text-sm text-muted-foreground">{perk.description}</div>
    {:else}
        <div class="text-sm text-red-600">An error occurred</div>
    {/if}

    <!-- TODO: Add purchase button -->
</div>
