<script lang="ts">
    import { State } from "$lib/connection";
    import { activityLog, connectionState } from "$lib/stores";
    import { onMount } from "svelte";
    import Text from "./Text.svelte";

    export let className: string;
    let autoScrollIntervalId: number | undefined = undefined;

    onMount(() => {
        // autoScrollIntervalId = setInterval(() => {}, 1000);
    });
</script>

<div
    class="flex flex-col text-slate-200 border-solid border-2 rounded-lg border-slate-200 {className}"
>
    <div class="text-md px-2 py-1 ml-auto z-20">
        {#if $connectionState === State.NOT_CONNECTED}
            <div class="text-red-500">NO CONNECTION</div>
        {:else if $connectionState === State.CONNECTING}
            <div class="text-blue-400">CONNECTING</div>
        {:else if $connectionState === State.CONNECTED}
            <div class="flex items-center gap-x-2">
                <div class="w-2 h-2 rounded-lg bg-lime-500 animate-pulse" />
                <div class="text-lime-500">CONNECTED</div>
            </div>
        {:else if $connectionState === State.DISCONNECTED}
            <div class="text-red-700">DISCONNECTED</div>
        {:else if $connectionState === State.ERROR}
            <div class="text-red-800">ERROR</div>
        {/if}
    </div>
    <div class="w-full h-1 bg-slate-200 z-20" />

    <div class="overflow-y-auto scroll-smooth">
        {#each $activityLog as log}
            <Text components={log} className="text-lg mx-3 my-1" />
        {/each}
    </div>
</div>
