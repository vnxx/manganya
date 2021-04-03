<script>
    export let slug;
    export let chapter;
</script>

<a
    href="/#/manga/{slug}/{chapter}"
    class="text-center p-3 bg-gray-800 hover:bg-gray-900 shadow-md transition duration-300 ease-in-out block"
>
    <slot />
</a>
