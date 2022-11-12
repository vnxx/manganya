<script>
    import { Link } from "svelte-navigator";
    export let slug;
    export let chapter;
    export let isSelected = false;
</script>

<div class="aspect-square">
    <Link
        to={`/manga/${slug}/${chapter}`}
        class={`text-center h-full flex justify-center items-center ${
            isSelected ? "bg-secondary text-white" : "bg-white text-gray-900"
        } text-lg font-bold hover:bg-secondary hover:text-white shadow-md transition duration-300 ease-in-out rounded-md`}
    >
        <slot />
    </Link>
</div>
