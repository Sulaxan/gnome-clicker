<!--
    Smart scrollable element which auto scrolls to the bottom, but does not auto scroll if the
    user manually scrolls up.
-->
<script lang="ts">
    import { onMount } from "svelte";

    const internalId = Date.now().toString();

    let autoScrollIntervalId: number | undefined = undefined;
    let cancelAutoScroll = false;

    onMount(() => {
        const element = document.getElementById(internalId);
        if (element === null) {
            console.log("SmartScrollable div null");
            return;
        }

        autoScrollIntervalId = setInterval(() => {
            if (!cancelAutoScroll) {
                element.scrollTop = element.scrollHeight;
            }
        }, 250);
    });

    function handleScroll() {
        const element = document.getElementById(internalId);
        if (element === null) {
            console.log("SmartScrollable div null");
            return;
        }

        // if scrolling is near the bottom, cancel auto scroll
        // we need to checkin within a threshold (1) since scrollTop iis a deicmal number
        cancelAutoScroll =
            Math.abs(element.scrollHeight - element.clientHeight - element.scrollTop) > 1;
    }
</script>

<div id={internalId} class="overflow-y-auto scroll-smooth" on:scroll={handleScroll}>
    <slot />
</div>
