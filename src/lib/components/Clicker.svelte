<script lang="ts">
    import { twMerge } from "tailwind-merge";

    export let className: string = "";
    export let clickFunc: (event: Event) => void = () => {};
</script>

<button
    on:click={clickFunc}
    class={twMerge(
        "text-5xl animate-gradient from-indigo-500 via-indigo-600 to-indigo-700 w-fit aspect-square rounded-[50%] border-2 border-primary hover:animate-none hover:bg-indigo-600 hover:border-yellow-400",
        className
    )}
>
    GNOME!
</button>
