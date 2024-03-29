<script lang="ts">
    import { State, type GnomeConnection } from "$lib/connection";
    import { activityLog } from "$lib/stores";
    import Text from "./Text.svelte";

    export let connection: GnomeConnection | null;
    export let className: string;
</script>

<div
    class="flex flex-col text-slate-200 border-solid border-2 rounded-lg border-slate-200 {className}"
>
    <div class="text-md px-2 py-1">
        {#if connection === null || connection?.getState() === State.NOT_CONNECTED}
            <div class="text-red-500">NO CONNECTION</div>
        {:else if connection?.getState() === State.CONNECTING}
            <div class="text-blue-400">CONNECTING</div>
        {:else if connection?.getState() === State.CONNECTED}
            <div class="text-lime-500">CONNECTED</div>
        {:else if connection?.getState() === State.DISCONNECTED}
            <div class="text-red-700">DISCONNECTED</div>
        {:else if connection?.getState() === State.ERROR}
            <div class="text-red-800">ERROR</div>
        {/if}
    </div>
    <div class="w-full h-1 bg-slate-200" />
    <div class="overflow-y-auto">
        {#each $activityLog as log}
            <Text components={log} className="text-lg mx-3 my-1" />
        {/each}
    </div>
</div>
