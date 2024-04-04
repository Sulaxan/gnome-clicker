<script lang="ts">
    export let gnomes: number;
    export let className: string = "";
</script>

<div class="text-5xl w-fit font-bold text-yellow-400 {className}">{gnomes.toLocaleString()} Gnomes</div>
