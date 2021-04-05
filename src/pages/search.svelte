<script>
    import Layout from "../components/Layout.svelte";
    import MangaItem from "../components/MangaItem.svelte";
    import { IcnGitHub } from "../components/Icons.svelte";
    import Button from "../components/Button.svelte";
    import Input from "../components/Input.svelte";
    import Loading from "../components/Loading.svelte";

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
            dataset ? "block" : "absolute min-h-screen"
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
                <div class="space-y-2 pt-3">
                    <a
                        class="text-center text-sm block"
                        href="https://www.instagram.com/keevnx/"
                        target="_blank">App by @keevnx</a
                    >
                    <a
                        class="text-center text-sm block fill-current"
                        href="https://github.com/vnxx/mangaku/"
                        target="_blank"
                    >
                        <div class="flex items-center justify-center">
                            <IcnGitHub />
                            <span class="pl-2">github.com/vnxx/mangaku</span>
                        </div>
                    </a>
                </div>
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
