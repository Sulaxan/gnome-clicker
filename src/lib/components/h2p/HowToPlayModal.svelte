<script lang="ts">
    import * as Dialog from "$lib/components/ui/dialog";
    import { Icon } from "@steeze-ui/svelte-icon";
    import { ArrowDown } from "@steeze-ui/heroicons";
    import Clicker from "../Clicker.svelte";
    import Card from "./Card.svelte";
    import GnomesDisplay from "../GnomesDisplay.svelte";
</script>

<Dialog.Root>
    <Dialog.Trigger class="gc-border px-3 py-1 uppercase hover:text-lime-300 hover:border-lime-300">
        How to Play
    </Dialog.Trigger>

    <Dialog.Content class="xl:min-w-[75%] xl:max-w-[75%] h-[85%] xl:h-fit">
        <Dialog.Header>
            <Dialog.Title class="text-2xl">How to Play</Dialog.Title>
        </Dialog.Header>

        <div class="overflow-y-auto">
            <div
                class="flex flex-col xl:flex-row items-center justify-center gap-x-3 gap-y-5 overflow-y-auto flex-grow"
            >
                <Card step={1} description="Click on clicker to generate Gnomes">
                    <Clicker className="text-4xl my-3" />
                </Card>
                <span class="hidden xl:inline-flex text-4xl">&gt;</span>
                <Card step={2} description="Spend Gnomes in the Perk Shop">
                    <div class="flex flex-col items-center mt-3">
                        <Icon src={ArrowDown} theme="solid" class="animate-bounce w-10 h-10" />
                        <div class="gc-border text-md px-3 py-1">Open Perk Shop</div>
                    </div>
                </Card>
                <span class="hidden xl:inline-flex text-4xl">&gt;</span>
                <Card step={3} description="Get as many Gnomes as you can!">
                    <GnomesDisplay gnomes={100000} className="text-xl text-center mt-3" />
                    <div class="text-lg text-center uppercase text-orange-500">High Score!</div>
                </Card>
            </div>
            <div class="flex flex-col mt-3">
                <h1 class="text-lg font-bold text-yellow-400">NOTE!</h1>
                <p class="text-md">
                    Gnomes are tracked for as long as you are in a voice channel. Once everyone in
                    the voice channel disconnects, the game will end!
                </p>
            </div>
        </div>
    </Dialog.Content>
</Dialog.Root>
