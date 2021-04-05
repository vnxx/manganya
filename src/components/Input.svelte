<script>
    export let placeholder = null;
    export let value = "";
</script>

<input
    class="w-full p-3 rounded-full outline-none text-gray-900 px-6"
    bind:value
    {placeholder}
/>
