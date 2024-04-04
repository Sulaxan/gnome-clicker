<script lang="ts">
    export let step: number;
    export let description: string;
</script>

<div class="flex flex-col relative items-center gc-border p-3 min-w-64 max-w-64 min-h-72 max-h-72">
    <div class="flex flex-col justify-center items-center h-[75%]">
        <slot />
    </div>

    <div class="absolute bottom-3 h-[25%]">
        <div class="text-lg text-center uppercase font-bold">Step {step}</div>
        <div class="text-lg text-center">{description}</div>
    </div>
</div>
