<script>
    import Layout from "../components/Layout.svelte";
    import MangaItem from "../components/MangaItem.svelte";
    import { onMount } from "svelte";
    import Loading from "../components/Loading.svelte";

    let dataset;
    onMount(async () => {
        await fetch("/api")
            .then((r) => r.json())
            .then((data) => {
                dataset = data.data;
            });
    });
</script>

{#if dataset}
    <Layout>
        <div class="grid grid-cols-2 xl:grid-cols-5 gap-6">
            {#each dataset as data}
                <MangaItem {data} />
            {/each}
        </div>
    </Layout>
{:else}
    <Loading />
{/if}
