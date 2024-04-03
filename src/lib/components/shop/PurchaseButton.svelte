<script lang="ts">
    import { attemptPerkPurchase } from "$lib/client_event_handler";
    import type { PerkGroup } from "$lib/gnome/perk";

    import { perks } from "$lib/stores";

    export let group: PerkGroup;
</script>

{#if $perks.get(group.id) === undefined || $perks.get(group.id) !== group.perks.length}
    <button
        class="text-md text-lime-600 px-3 py-1 mt-5 uppercase gc-border border-lime-600"
        on:click={() => attemptPerkPurchase(group)}
    >
        Purchase Next Tier
    </button>
{:else}
    <div class="text-sm text-red-600">Max Tier Purchased</div>
{/if}
