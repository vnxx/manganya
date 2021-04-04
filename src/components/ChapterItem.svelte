<script>
    export let slug;
    export let chapter;
    export let isSelected = false;
</script>

<div class="aspect-w-1 aspect-h-1">
    <a
        href="/#/manga/{slug}/{chapter}"
        class={`text-center flex justify-center items-center ${
            isSelected ? "bg-gray-900 text-white" : "bg-white text-gray-900"
        } text-lg font-bold hover:bg-gray-900 hover:text-white shadow-md transition duration-300 ease-in-out rounded-md`}
    >
        <slot />
    </a>
</div>
