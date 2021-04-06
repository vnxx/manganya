<script>
    import { onMount } from "svelte";

    import { IcnPlus, IcnClose } from "../components/Icons.svelte";

    export let data;
    let isInFavorite = false;

    onMount(() => {
        let favorites = getFavorites();

        if (favorites.filter((val) => val.slug === data.slug).length > 0) {
            isInFavorite = true;
        }
    });

    function getFavorites() {
        let favorites = JSON.parse(localStorage.getItem("favorites"));
        favorites = favorites ? favorites : [];

        return favorites;
    }

    function addFavorite() {
        let favorites = getFavorites();

        favorites.unshift({
            title: data.title,
            slug: data.slug,
            cover: data.cover,
        });

        localStorage.setItem("favorites", JSON.stringify(favorites));

        isInFavorite = true;
    }

    function removeFavorite() {
        let favorites = getFavorites();

        localStorage.setItem(
            "favorites",
            JSON.stringify(favorites.filter((val) => val.slug !== data.slug))
        );

        isInFavorite = false;
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
