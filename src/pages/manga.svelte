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
    <Layout px="0" spaceY="0" isLayeringHeader={true}>
        <div class="block xl:flex">
            <div class="relative xl:w-1/2 xl:top-0">
                <div class="block xl:sticky top-0">
                    <div class="bg-black opacity-40 w-full xl:w-3/4">
                        <img
                            src={dataset.cover}
                            alt="Solo Leveling"
                            class="w-full pr-0 h-full block  top-3"
                        />
                    </div>
                    <div class="px-3 -top-32 xl:w-3/4 relative shadow-lg">
                        <div class="space-y-3 bg-gray-800 rounded-lg p-5">
                            <h1 class="text-xl font-bold">
                                {dataset.title}
                            </h1>
                            <hr
                                class="w-2/4 border-none h-0.5 bg-white rounded-full"
                            />
                            <p>
                                {dataset.sinopsis}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div
                class="px-3 w-full xl:w-1/2 xl:px-0 -mt-32 xl:mt-0 relative pt-8 xl:pt-0"
            >
                <div class="grid grid-cols-5 xl:grid-cols-6 gap-3">
                    {#each dataset.chapters as chapter}
                        <ChapterItem {chapter} slug={params.slug}
                            >{chapter}</ChapterItem
                        >
                    {/each}
                </div>
            </div>
        </div>
    </Layout>
{:else}
    <Loading />
{/if}
