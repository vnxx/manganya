<script>
    import { onMount } from "svelte";

    import { IcnPlus, IcnClose } from "../components/Icons.svelte";
    import { isInFavorites, getFavorites } from "../helper";

    export let data;
    export let callback;
    let isInFavorite = false;

    onMount(() => {
        if (isInFavorites(data.slug)) {
            isInFavorite = true;
        }
    });

    function addFavorite() {
        let favorites = getFavorites();

        favorites.unshift({
            title: data.title,
            slug: data.slug,
            cover: data.cover,
        });

        localStorage.setItem("favorites", JSON.stringify(favorites));

        isInFavorite = true;
        if (callback) {
            callback();
        }
    }

    function removeFavorite() {
        let favorites = getFavorites();

        localStorage.setItem(
            "favorites",
            JSON.stringify(favorites.filter((val) => val.slug !== data.slug))
        );

        isInFavorite = false;
        if (callback) {
            callback();
        }
    }
</script>

<button on:click={() => (isInFavorite ? removeFavorite() : addFavorite())}>
    <div
        class={`shadow-md fill-current flex justify-center items-center p-2 w-auto rounded-full ${
            isInFavorite ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        } text-md px-4 font-bold transition-all duration-300 ease-in-out`}
    >
        {#if isInFavorite}
            <IcnClose />
        {:else}
            <IcnPlus />
        {/if}
        <span class="pl-3">Favorite</span>
    </div>
</button>
