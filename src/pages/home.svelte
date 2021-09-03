<script>
    import Layout from "../components/Layout.svelte";
    import MangaItem from "../components/MangaItem.svelte";
    import { onMount } from "svelte";
    import { useNavigate } from "svelte-navigator";

    let dataset = [];
    let continueReading = [];
    let errorMessage = null;
    let isLoading = true;
    let itemWidth = 0;

    const navigate = useNavigate();

    window.scrollTo(0, 0);

    onMount(async () => {
        await fetch("/api")
            .then((r) => r.json())
            .then((data) => {
                if (data.status == "SUCCESS") {
                    dataset = data.data;
                } else {
                    dataset = [];
                    errorMessage = data.message;
                }
                isLoading = false;
            });
    });

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
</script>

<Layout title="Home">
    {#if !window.matchMedia("(display-mode: standalone)").matches}
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
    {/if}

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
        {#if errorMessage}
            <div class="text-center bg-red-900 text-white py-6">
                {errorMessage}
            </div>
            <div class="sk-t" />
        {/if}

        <div class="grid grid-cols-2 xl:grid-cols-5 gap-6">
            {#if !isLoading}
                {#each dataset as data}
                    <MangaItem {data} />
                {/each}
            {:else}
                {#each Array(40) as _}
                    <div class="animate-pulse">
                        <div
                            class="aspect-w-1 aspect-h-1 rounded-md overflow-hidden"
                        >
                            <div class="animate-pulse bg-gray-800" />
                        </div>
                        <div
                            class="mt-3 sk-t sk-t w-full bg-gray-800 animate-pulse rounded-md"
                        />
                    </div>
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
