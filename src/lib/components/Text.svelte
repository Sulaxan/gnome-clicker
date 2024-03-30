<script lang="ts">
    import { DEFAULT_COLOR, type TextComponent } from "$lib/protocol/text";

    export let components: TextComponent[];
    export let className: string = "";
    export let defaultColor: string = DEFAULT_COLOR;
</script>

<div class={className}>
    <div>
        {#each components as component}
            {#if component.type === "space"}
                <span>&nbsp;</span>
            {:else if component.type === "default"}
                <span
                    style="color: {component.color !== undefined ? component.color : defaultColor};"
                    class:font-bold={component.bold}
                    class:italic={component.italic}
                >
                    {component.content}
                </span>
            {/if}
        {/each}
    </div>
</div>
