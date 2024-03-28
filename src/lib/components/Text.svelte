<script lang="ts">
    import { DEFAULT_COLOR, type TextComponent } from "$lib/protocol/text";

    export let components: TextComponent[];
    export let className: string = "";
</script>

<div class="flex {className}">
    <p>
        {#each components as component}
            {#if component.type === "space"}
                <span>&nbsp;</span>
            {:else if component.type === "default"}
                <span
                    style="color: {component.color !== undefined
                        ? component.color
                        : DEFAULT_COLOR};"
                    class:font-bold={component.bold}
                    class:italic={component.italic}
                >
                    {component.content}
                </span>
            {/if}
        {/each}
    </p>
</div>
