<script>
    import Layout from "../components/Layout.svelte";
    import MangaItem from "../components/MangaItem.svelte";
    import { onMount } from "svelte";

    let dataset = [];
    onMount(() => {
        let favorites = JSON.parse(localStorage.getItem("favorites"));
        favorites = favorites ? favorites : [];
        dataset = favorites;
    });
</script>

<Layout title="Favorites">
    <section>
        <h1 class="font-bold text-2xl mb-5">Favorites</h1>
        <div class="grid grid-cols-2 xl:grid-cols-5 gap-6">
            {#each dataset as data}
                <MangaItem {data} />
            {/each}
        </div>
    </section>
</Layout>
