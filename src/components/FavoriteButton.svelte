<script>
    import { onMount } from "svelte";

    import { IcnPlus, IcnClose } from "../components/Icons.svelte";
    import { isInFavorites, getFavorites } from "../lib/helper";
    import Button from "./Button.svelte";

    let clazz;
    export let data;
    export let callback;
    export { clazz as class };
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

<Button
    class={`fill-current ${clazz} `}
    size="sm"
    theme={isInFavorite ? "red" : "secondary"}
    onclick={isInFavorite ? removeFavorite : addFavorite}
>
    <IcnPlus />
</Button>
