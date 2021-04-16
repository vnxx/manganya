<script>
    import Layout from "../components/Layout.svelte";
    import MangaItem from "../components/MangaItem.svelte";
    import { onMount } from "svelte";
    import { push } from "svelte-spa-router";

    let dataset = [];
    let continueReading = [];

    onMount(async () => {
        await fetch("/api")
            .then((r) => r.json())
            .then((data) => {
                dataset = data.data;
            });
    });

    onMount(() => {
        let histories = JSON.parse(localStorage.getItem("histories"));
        histories = histories ? histories : [];

        continueReading = histories;
    });
</script>

<Layout>
    {#if !window.matchMedia("(display-mode: standalone)").matches}
        <section class="xl:hidden">
            <h2 class="font-bold text-2xl mb-3">Aplikasi Manganya</h2>
            <div class="flex space-x-8">
                <button
                    on:click={() => push("/installation-guide")}
                    class="text-left"
                >
                    <p>Download</p>
                    <p>Android App</p>
                </button>
                <button
                    on:click={() => push("/installation-guide")}
                    class="text-left"
                >
                    <p>Download</p>
                    <p>IOS App</p>
                </button>
            </div>
        </section>
    {/if}

    {#if continueReading.length > 0}
        <section>
            <h2 class="font-bold text-2xl mb-5">Lanjut Baca</h2>
            <div class="grid grid-cols-2 xl:grid-cols-5 gap-6">
                {#each continueReading.slice(0, 5) as data}
                    <MangaItem {data} />
                {/each}
            </div>
        </section>
    {/if}

    <section>
        <h2 class="font-bold text-2xl mb-5">Terbaru</h2>
        <div class="grid grid-cols-2 xl:grid-cols-5 gap-6">
            {#if dataset.length > 0}
                {#each dataset as data}
                    <MangaItem {data} />
                {/each}
            {:else}
                {#each Array(40) as _}
                    <div class="animate-pulse">
                        <div
                            class="aspect-w-1 aspect-h-1 rounded-md overflow-hidden"
                        >
                            <div class="animate-pulse bg-gray-800" />
                        </div>
                        <div
                            class="mt-3 sk-t sk-t w-full bg-gray-800 animate-pulse rounded-md"
                        />
                    </div>
                {/each}
            {/if}
        </div>
    </section>
</Layout>

<style>
    .sk-t {
        height: 28px;
    }
</style>
