<script>
    import Layout from "../components/Layout.svelte";
    import { onMount } from "svelte";
    import Loading from "../components/Loading.svelte";

    export let params;
    let dataset;
    let loading = true;

    onMount(async () => {
        call(params.chapter);
    });

    async function call(chapter) {
        loading = true;
        await fetch(`/api/manga/${params.slug}/${chapter}`)
            .then((r) => r.json())
            .then((data) => {
                dataset = data;
                loading = false;
            });
    }
</script>

{#if !loading}
    <Layout px="0">
        <h1 class="text-3xl px-3 font-bold">
            {dataset.title}
        </h1>
        <div>
            {#each dataset.data as url, i}
                <img src={url} alt={`${dataset.title}-image-${i + 1}`} />
            {/each}
        </div>
        <div class="p-2" />
        <div class="fixed bottom-0 flex bg-gray-800 w-full max-w-5xl">
            {#if dataset.prev}
                <a
                    href={`/#/manga/${params.slug}/${dataset.prev}`}
                    class="w-full p-2 text-center hover:bg-gray-900 transaition duration-300 ease-in-out"
                    on:click={call(dataset.prev)}
                >
                    Prev
                </a>
            {/if}

            {#if dataset.next}
                <a
                    href={`/#/manga/${params.slug}/${dataset.next}`}
                    class="w-full p-2 text-center hover:bg-gray-900 transaition duration-300 ease-in-out"
                    on:click={call(dataset.next)}
                >
                    Next
                </a>
            {/if}
        </div>
    </Layout>
{:else}
    <Loading />
{/if}
