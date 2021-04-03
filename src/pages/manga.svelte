<script>
    import Layout from "../components/Layout.svelte";
    import ChapterItem from "../components/ChapterItem.svelte";
    import { onMount } from "svelte";
    import Loading from "../components/Loading.svelte";
    export let params;

    let dataset;
    onMount(async () => {
        await fetch("/api/manga/" + params.slug)
            .then((r) => r.json())
            .then((data) => {
                dataset = data;
            });
    });
</script>

{#if dataset}
    <Layout>
        <div class="block space-y-3 xl:flex xl:space-y-0">
            <img
                src={dataset.cover}
                alt="Solo Leveling"
                class="w-full xl:w-1/3 pr-0 xl:pr-5 h-full block xl:sticky top-3"
            />
            <div class="space-y-3">
                <h1 class="text-3xl font-bold">
                    {dataset.title}
                </h1>
                <div class="space-y-3">
                    {#each dataset.chapters as chapter}
                        <ChapterItem {chapter} slug={params.slug}
                            >Chapter {chapter}</ChapterItem
                        >
                    {/each}
                </div>
            </div>
        </div>
    </Layout>
{:else}
    <Loading />
{/if}
