<script lang="ts">
    import * as Dialog from "$lib/components/ui/dialog";
    import { writable, type Writable } from "svelte/store";
    import ShopOverview from "./ShopOverview.svelte";
    import type { PerkShowcase } from ".";
    import ShopDetailedPerkView from "./ShopDetailedPerkView.svelte";

    const currentPerkShowcase: Writable<PerkShowcase | undefined> = writable(undefined);
</script>

<Dialog.Root>
    <Dialog.Trigger
        class="gc-border px-3 py-1 hover:border-indigo-300 hover:text-indigo-300"
    >
        Open Perk Shop
    </Dialog.Trigger>
    <Dialog.Content class="flex flex-col min-w-[75%] max-w-[75%] max-h-[75%]">
        <Dialog.Header>
            <Dialog.Title class="text-2xl font-bold">Perk Shop</Dialog.Title>
            <Dialog.Description>View and purchase perks.</Dialog.Description>
        </Dialog.Header>

        <div class="overflow-y-auto max-h-full gc-border rounded-lg p-3">
            {#if $currentPerkShowcase === undefined}
                <ShopOverview perkShowcase={currentPerkShowcase} />
            {:else}
                <ShopDetailedPerkView perkShowcase={currentPerkShowcase} />
            {/if}
        </div>
    </Dialog.Content>
</Dialog.Root>
