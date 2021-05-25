<script>
    import Layout from "../components/Layout.svelte";
    import ChapterItem from "../components/ChapterItem.svelte";
    import { onMount } from "svelte";
    import Loading from "../components/Loading.svelte";
    import { push } from "svelte-spa-router";
    import FavoriteButton from "../components/FavoriteButton.svelte";
    import ErrorResponse from "../components/ErrorResponse.svelte";
    import {
        isInFavorites,
        removeFromHistories,
        isInHistories,
    } from "../helper";
    import MyButton from "../components/Button.svelte";
    export let params;

    let dataset;
    let continueReading;
    let error = null;
    let isLoading = true;
    let isInFavorite = false;
    let isInHistory = false;

    onMount(async () => {
        await fetch("/api/manga/" + params.slug)
            .then((r) => r.json())
            .then((data) => {
                if (data.status == "SUCCESS") {
                    dataset = data;
                } else {
                    error = data;
                }
                isLoading = false;
            });
    });

    onMount(() => {
        let histories = JSON.parse(localStorage.getItem("histories"));
        histories = histories ? histories : [];

        continueReading = histories.filter(
            (val) => val.slug === params.slug
        )[0];

        if (isInFavorites(params.slug)) {
            isInFavorite = true;
        }
        if (isInHistories(params.slug)) {
            isInHistory = true;
        }
    });

    function removeFH() {
        removeFromHistories(params.slug);
        isInHistory = false;
    }
</script>

{#if !isLoading}
    <Layout px="0" slotClass="space-y-0" isLayeringHeader={error == null}>
        {#if error}
            <div class="space-y-6">
                <ErrorResponse {error} />

                <div class="w-full space-y-3 px-3">
                    {#if isInFavorite}
                        <FavoriteButton
                            class="m-auto w-max block"
                            callback={() => (isInFavorite = false)}
                            data={{
                                title: null,
                                slug: params.slug,
                                cover: null,
                            }}
                        />
                    {/if}
                    {#if isInHistory}
                        <MyButton
                            onclick={() => removeFH()}
                            class="w-max px-6 block m-auto"
                            >Hapus Manga Dari History</MyButton
                        >
                    {/if}
                </div>
            </div>
        {:else}
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
                        <div class="px-3 -top-52 xl:w-3/4 relative shadow-lg">
                            <div class="flex mb-6 justify-between">
                                <div class="block space-y-3">
                                    {#if continueReading}
                                        <button
                                            on:click={() =>
                                                push(
                                                    `/manga/${params.slug}/${continueReading.history.current_chapter}`
                                                )}
                                            class="p-2 px-4 bg-white text-gray-800 rounded-full font-bold text-sm hover:bg-gray-900 hover:text-white shadow-md transition-all duration-300 ease-in-out"
                                        >
                                            Lanjut Baca: CH {continueReading
                                                .history.current_chapter}
                                        </button>
                                        {#if continueReading.history.next_chapter}
                                            <button
                                                on:click={() =>
                                                    push(
                                                        `/manga/${params.slug}/${continueReading.history.next_chapter}`
                                                    )}
                                                class="p-2 px-4 bg-white text-gray-800 rounded-full font-bold text-sm hover:bg-gray-900 hover:text-white shadow-md transition-all duration-300 ease-in-out"
                                            >
                                                Pindah Ke: CH {continueReading
                                                    .history.next_chapter}
                                            </button>
                                        {/if}
                                    {/if}
                                </div>
                                <div class="flex mt-auto">
                                    <FavoriteButton
                                        data={{
                                            title: dataset.title,
                                            slug: params.slug,
                                            cover: dataset.cover,
                                        }}
                                    />
                                </div>
                            </div>

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
                    class="px-3 w-full xl:w-1/2 xl:px-0 -mt-52 xl:mt-0 relative pt-8 xl:pt-0"
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
        {/if}
    </Layout>
{:else}
    <Loading />
{/if}
