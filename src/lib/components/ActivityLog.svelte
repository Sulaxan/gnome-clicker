<script lang="ts">
    import { activityLog } from "$lib/stores";
    import Text from "./Text.svelte";

    export let className: string;
</script>

<div
    class="flex flex-col text-slate-200 border-solid border-2 rounded-lg border-slate-200 {className}"
>
    <h1 class="text-lg px-2 py-1">Activity Log</h1>
    <div class="w-full h-1 bg-slate-200" />
    <div class="overflow-y-auto">
        {#each $activityLog as log}
            <div class="text-lg mx-3 my-1">
                <Text components={log}/>
            </div>
        {/each}
    </div>
</div>
