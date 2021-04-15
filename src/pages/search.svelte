<script>
    import Layout from "../components/Layout.svelte";
    import MangaItem from "../components/MangaItem.svelte";
    import Button from "../components/Button.svelte";
    import Input from "../components/Input.svelte";
    import Loading from "../components/Loading.svelte";
    import Footer from "../components/Footer.svelte";

    let search = "";
    let dataset;
    let loading = false;

    async function searchData() {
        loading = true;

        if (search !== "") {
            await fetch(`/api/manga/search?search=${search}`)
                .then((r) => r.json())
                .then((data) => {
                    dataset = data;
                    loading = false;
                });
        }
    }
</script>

<Loading isLoading={loading} />

<Layout spaceY="0" myClass={dataset ? "min-h-screen" : null}>
    <div
        class={`${
            dataset ? "block" : "absolute z-0 min-h-screen"
        } z-0 top-0 w-full xl:max-w-5xl px-3 left-0 flex`}
    >
        <div class="space-y-3 w-full xl:w-1/2 m-auto">
            {#if !dataset}
                <h1 class="text-center font-bold text-3xl pb-3">Cari Manga</h1>
            {/if}
            <form
                class="space-y-3"
                on:submit|preventDefault={() => searchData()}
            >
                <Input bind:value={search} placeholder="hataraku maou sama!" />
                <Button type="submit">Cari</Button>
            </form>

            {#if !dataset}
                <Footer class="pt-3" />
            {/if}
        </div>
    </div>
    {#if dataset}
        <div class="grid grid-cols-2 xl:grid-cols-5 gap-6 pt-6">
            {#each dataset.data as data}
                <MangaItem {data} />
            {/each}
        </div>
    {/if}
</Layout>
