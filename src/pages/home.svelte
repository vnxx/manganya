<script>
    // @ts-nocheck

    import { onMount } from "svelte";
    import { Link } from "svelte-navigator";

    import Layout from "../components/Layout.svelte";
    import MangaItem from "../components/MangaItem.svelte";
    import TypeItem from "../components/Home/TypeItem.svelte";
    import ContributionBanner from "../components/Home/ContributionBanner.svelte";

    import { useEffect } from "../components/hook";

    const api_url = import.meta.env.VITE_API_URL;
    const params = new URLSearchParams(window.location.search);

    let dataset = [];
    let continueReading = [];
    let errorMessage = null;
    let isLoading = true;
    let itemWidth = 0;
    let type = params.get("type") ?? "all";

    window.scrollTo(0, 0);

    async function getComicks() {
        isLoading = true;
        const r = await fetch(`${api_url}/?type=${type}`);
        const data = await r.json();
        if (data.status == "SUCCESS") {
            dataset = data.data;
        } else {
            dataset = [];
            errorMessage = data.message;
        }
        isLoading = false;
    }

    function updateItemWidth() {
        let gapCount = 2;
        let containerWidth =
            document.getElementsByClassName("main-caontainer")[0].clientWidth;
        if (window.innerWidth > 1024) {
            gapCount = 5;
        }

        itemWidth = (containerWidth - (gapCount - 1) * 24) / gapCount;
    }

    onMount(() => {
        let histories = JSON.parse(localStorage.getItem("histories"));
        histories = histories ? histories : [];

        continueReading = histories;

        updateItemWidth();

        window.addEventListener("resize", () => {
            updateItemWidth();
        });
    });

    useEffect(
        () => {
            getComicks();
        },
        () => [type]
    );

    const typeItems = [
        {
            label: "Semua Komik",
            type: "all",
            image: null,
        },
        {
            label: "Manga",
            type: "manga",
            image: "/assets/manga.jpeg",
        },
        {
            label: "Manhua",
            type: "manhua",
            image: "/assets/manhua.jpeg",
        },
        {
            label: "Manhwa",
            type: "manhwa",
            image: "/assets/manhwa.jpeg",
        },
    ];
</script>

<Layout title="Home">
    <!-- {#if !window.matchMedia("(display-mode: standalone)").matches}
        <section class="xl:hidden">
            <h2 class="font-bold text-2xl mb-3">Aplikasi Manganya</h2>
            <div class="flex space-x-8">
                <button
                    on:click={() => navigate("/installation-guide")}
                    class="text-left"
                >
                    <p>Download</p>
                    <p>Android App</p>
                </button>
                <button
                    on:click={() => navigate("/installation-guide")}
                    class="text-left"
                >
                    <p>Download</p>
                    <p>IOS App</p>
                </button>
            </div>
        </section>
    {/if} -->

    <ContributionBanner />

    {#if continueReading.length > 0}
        <section>
            <h2 class="font-bold text-2xl mb-5">Lanjut Baca</h2>
            <div class="flex overflow-x-auto space-x-6">
                {#each continueReading.slice(0, 5) as data}
                    <MangaItem width={`${itemWidth}px`} {data} />
                {/each}
            </div>
        </section>
    {/if}

    <section>
        <h2 class="font-bold text-2xl mb-5">Terbaru</h2>

        <div
            class="flex overflow-auto mb-8 whitespace-nowrap text-sm space-x-6"
        >
            {#each typeItems as item}
                <TypeItem
                    currentType={type}
                    {...item}
                    onClick={() => (type = item.type)}
                />
            {/each}
        </div>

        {#if errorMessage}
            <div class="text-center bg-red-900 text-white py-6">
                {errorMessage}
            </div>
            <div class="sk-t" />
        {/if}

        <div class="grid grid-cols-2 xl:grid-cols-5 gap-6 gap-y-8">
            {#if !isLoading}
                {#each dataset as data}
                    <MangaItem {data} />
                {/each}
            {:else}
                {#each Array(40) as _}
                    <MangaItem isSkeletonOnly />
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
