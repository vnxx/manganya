<script>
    export let onclick = null;
    export let type;
</script>

<button
    {type}
    on:click={onclick}
    class="p-3 rounded-full outline-none bg-gray-800 w-full shadow-xl hover:bg-gray-900 transition-all ease-in-out duration-300"
    ><slot /></button
>
