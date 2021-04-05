<script>
    export let isLoading = true;
</script>

<div
    class={`w-full h-full fixed top-0 bg-gray-900 ${
        isLoading ? "opacity-100" : "opacity-0 invisible"
    } z-40 transition-all duration-300 ease-in-out`}
/>

<div
    id="loading"
    class={`flex h-screen w-full justify-center items-center z-50 absolute top-0 transition-all duration-300 ease-in-out ${
        isLoading ? "opacity-100" : "opacity-0 invisible"
    }`}
>
    <div class="w-full">
        <img class="w-1/2 xl:w-2/12 m-auto" src="/loading.gif" alt="Loading" />
        <p class="text-white text-center mt-3 text-lg">Loading Moment</p>
    </div>
</div>
