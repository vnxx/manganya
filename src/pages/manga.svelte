<script>
    // @ts-nocheck

    import Layout from "../components/Layout.svelte";
    import { useNavigate } from "svelte-navigator";
    import ChapterItem from "../components/ChapterItem.svelte";
    import {
        IcnOutlineCalendar,
        IcnOutlineClock,
        IcnOutlineEye,
        IcnOutlineLightBulp,
        IcnOutlineRefresh,
        IcnShare,
    } from "../components/Icons.svelte";
    import { onMount } from "svelte";
    import Loading from "../components/Loading.svelte";
    import FavoriteButton from "../components/FavoriteButton.svelte";
    import ErrorResponse from "../components/ErrorResponse.svelte";
    import ShareBox from "../components/ShareBox.svelte";
    import {
        isInFavorites,
        removeFromHistories,
        isInHistories,
        getHistories,
    } from "../lib/helper";
    import MyButton from "../components/Button.svelte";
    import Button from "../components/Button.svelte";
    import InfoItem from "../components/Manga/InfoItem.svelte";
    export let slug;

    const api_url = import.meta.env.VITE_API_URL;

    let dataset;
    let continueReading;
    let error = null;
    let isLoading = true;
    let isInFavorite = false;
    let isInHistory = false;
    let isShareBarOpen = false;

    const navigate = useNavigate();

    onMount(async () => {
        await fetch(`${api_url}/manga/${slug}`)
            .then((r) => r.json())
            .then((response) => {
                const data = response.data;
                if (response.status == "SUCCESS") {
                    dataset = data;
                } else {
                    error = data;
                }

                //  check next_chapter
                let histories = getHistories();
                let h_i_open = histories.map((e) => e.slug).indexOf(slug);
                if (
                    h_i_open > -1 &&
                    (typeof histories[h_i_open].history.next_chapter ===
                        "undefined" ||
                        histories[h_i_open].history.next_chapter === null)
                ) {
                    let index = data.chapters.indexOf(
                        histories[h_i_open].history.current_chapter
                    );
                    if (data.chapters.length > index) {
                        histories[h_i_open].history.next_chapter =
                            data.chapters[index - 1];
                        localStorage.setItem(
                            "histories",
                            JSON.stringify(histories)
                        );
                    }
                }

                continueReading = histories[h_i_open];

                isLoading = false;
            });
    });

    onMount(() => {
        if (isInFavorites(slug)) {
            isInFavorite = true;
        }
        if (isInHistories(slug)) {
            isInHistory = true;
        }
    });

    function removeFH() {
        removeFromHistories(slug);
        isInHistory = false;
    }
</script>

{#if !isLoading}
    <Layout
        title="Manga Detail"
        px={0}
        slotClass="space-y-0"
        isLayeringHeader={error == null}
    >
        {#if error}
            <div class="space-y-6">
                <ErrorResponse {error} />

                <div class="w-full space-y-3 px-3">
                    {#if isInFavorite}
                        <FavoriteButton
                            class="m-auto block"
                            callback={() => (isInFavorite = false)}
                            data={{
                                title: null,
                                slug: slug,
                                cover: null,
                            }}
                        />
                    {/if}
                    {#if isInHistory}
                        <MyButton
                            type="defualt"
                            onclick={() => removeFH()}
                            class="w-max px-6 block m-auto"
                            >Hapus Manga Dari History</MyButton
                        >
                    {/if}
                </div>
            </div>
        {:else}
            <div class="block xl:flex xl:pt-10">
                <div class="relative xl:w-1/2 xl:top-0">
                    <div class="block xl:sticky top-0">
                        <div
                            class="bg-black opacity-40 w-full xl:w-3/4 overflow-hidden"
                        >
                            <img
                                src={dataset.cover}
                                alt="Solo Leveling"
                                class="w-full pr-0 h-full block blur-sm top-3"
                            />
                        </div>
                        <div class="top-[-240px] xl:w-3/4 relative">
                            <div
                                class="space-y-6 bg-primary rounded-t-[30px] p-5 pb-12"
                            >
                                <div
                                    class="flex w-full justify-between items-center flex-0"
                                >
                                    <img
                                        src={dataset.type.image}
                                        alt={dataset.type.name}
                                        class="h-fit"
                                    />

                                    <div class="flex space-x-3">
                                        <Button
                                            onclick={() =>
                                                (isShareBarOpen = true)}
                                            size="sm"
                                            theme="secondary"
                                        >
                                            <IcnShare
                                                class="fill-current mr-2 w-4 h-4"
                                            />
                                            Bagikan
                                        </Button>

                                        <FavoriteButton
                                            class=""
                                            data={{
                                                title: dataset.title,
                                                slug: slug,
                                                cover: dataset.cover,
                                            }}
                                            callback={() => {}}
                                        />
                                    </div>
                                </div>
                                <h1 class="text-2xl font-bold">
                                    {dataset.title}
                                </h1>
                                <p class="leading-7 text-sm line-clamp-3">
                                    {dataset.sinopsis}
                                </p>

                                {#if continueReading}
                                    <div
                                        class={`grid gap-3 ${
                                            continueReading.history.next_chapter
                                                ? "grid-cols-2"
                                                : "grid-cols-1"
                                        }`}
                                    >
                                        {#if continueReading.history.next_chapter}
                                            <Button
                                                class="text-[0.875rem]"
                                                onclick={() =>
                                                    navigate(
                                                        `/manga/${slug}/${continueReading.history.next_chapter}`
                                                    )}
                                                theme="red"
                                                size="lg"
                                            >
                                                <IcnOutlineLightBulp
                                                    class="mr-2"
                                                />
                                                Baca Ch {continueReading.history
                                                    .next_chapter}
                                            </Button>
                                        {/if}

                                        <Button
                                            class="text-[0.875rem]"
                                            onclick={() =>
                                                navigate(
                                                    `/manga/${slug}/${continueReading.history.current_chapter}`
                                                )}
                                            theme="secondary"
                                            size="lg"
                                        >
                                            <IcnOutlineRefresh class="mr-2" />
                                            Lanjut Ch {continueReading.history
                                                .current_chapter}
                                        </Button>
                                    </div>
                                {/if}
                            </div>

                            <div
                                class="flex px-5 bg-primary overflow-auto space-x-4"
                            >
                                <InfoItem
                                    icon={IcnOutlineCalendar}
                                    label="Rilis"
                                    value={dataset.releaseYear}
                                />

                                <InfoItem
                                    icon={IcnOutlineClock}
                                    label="Status"
                                    value={dataset.status}
                                />

                                <InfoItem
                                    icon={IcnOutlineEye}
                                    label="Dilihat"
                                    value={dataset.views}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    class="px-5 w-full xl:w-1/2 xl:px-0 -mt-52 xl:mt-0 relative pt-8 xl:pt-0"
                >
                    <h2 class="mb-8 text-2xl font-bold">Chapters</h2>
                    <div class="grid grid-cols-5 xl:grid-cols-6 gap-3">
                        {#each dataset.chapters as chapter}
                            <ChapterItem {chapter} {slug}>{chapter}</ChapterItem
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

<ShareBox isOpen={isShareBarOpen} onClose={() => (isShareBarOpen = false)} />
