<script>
    import Layout from "../components/Layout.svelte";
    import MangaItem from "../components/MangaItem.svelte";
    import { onMount } from "svelte";

    let dataset;
    onMount(async () => {
        await fetch("/api")
            .then((r) => r.json())
            .then((data) => {
                dataset = data.data;
            });
    });
</script>

<Layout>
    <header>
        <h1 class="text-white text-3xl font-bold">Home</h1>
    </header>
    <div class="grid grid-cols-2 xl:grid-cols-5 gap-5">
        {#if dataset}
            {#each dataset as data}
                <MangaItem {data} />
            {/each}
        {:else}
            <p>Loading...</p>
        {/if}
    </div>
</Layout>
