<script>
    import Layout from "../components/Layout.svelte";
    import MangaItem from "../components/MangaItem.svelte";
    import { onMount } from "svelte";

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

<Layout spaceY="6">
    {#if continueReading.length > 0}
        <section>
            <h2 class="font-bold text-2xl mb-5">Lanjut Baca</h2>
            <div class="grid grid-cols-2 xl:grid-cols-5 gap-6">
                {#each continueReading as data}
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
                        <div class="sk animate-pulse bg-gray-800" />
                        <div
                            class="mt-3 sk-t w-full bg-gray-800 animate-pulse"
                        />
                    </div>
                {/each}
            {/if}
        </div>
    </section>
</Layout>

<style>
    .sk {
        height: 233px;
    }
    .sk-t {
        height: 28px;
    }
</style>
