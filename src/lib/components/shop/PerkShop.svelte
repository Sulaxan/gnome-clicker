<script lang="ts">
    import * as Dialog from "$lib/components/ui/dialog";
    import { writable, type Writable } from "svelte/store";
    import ShopOverview from "./ShopOverview.svelte";
    import type { PerkShowcase } from ".";
    import ShopDetailedPerkView from "./ShopDetailedPerkView.svelte";

    const currentPerkShowcase: Writable<PerkShowcase | undefined> = writable(undefined);
</script>

<Dialog.Root>
    <Dialog.Trigger>Open Perk Shop</Dialog.Trigger>
    <Dialog.Content class="min-w-[75%] max-w-[75%] min-h-[75%] max-h-[75%]">
        <Dialog.Header>
            <Dialog.Title>Perk Shop</Dialog.Title>
            <Dialog.Description>View and purchase all perks.</Dialog.Description>
        </Dialog.Header>

        {#if $currentPerkShowcase === undefined}
            <ShopOverview perkShowcase={currentPerkShowcase} />
        {:else}
            <ShopDetailedPerkView perkShowcase={currentPerkShowcase} />
        {/if}
    </Dialog.Content>
</Dialog.Root>
