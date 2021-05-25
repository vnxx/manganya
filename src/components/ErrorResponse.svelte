<script>
    export let error;
</script>

<div class="text-center space-y-3 text-white">
    <img
        class="w-full xl:w-1/2 m-auto"
        src="/data_broken.gif"
        alt="data broken"
    />
    <p class="font-bold text-lg">
        {error.message}
    </p>
</div>
