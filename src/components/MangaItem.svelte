<script>
    export let data;
    let isImageOnLoad = false;

    function updateLoad() {
        setTimeout(() => {
            isImageOnLoad = true;
        }, 200);
    }
</script>

<a href="#/manga/{data.slug}">
    <div
        class={`manga-item-cover bg-gray-800  ${
            !isImageOnLoad ? "animate-pulse" : "animate-none"
        }`}
    >
        <img
            on:load={updateLoad()}
            src={data.cover}
            alt={data.title}
            width="100%"
            class={`transition-all duration-300 ease-in-out ${
                isImageOnLoad ? "opacity-100" : "opacity-0"
            }`}
        />
    </div>
    <div class="mt-3">
        <p
            class={`text-lg w-full truncate font-bold text-white transition-all duration-300 ease-in-out ${
                isImageOnLoad
                    ? "opacity-100 animate-none"
                    : "opacity-0 animate-pulse"
            }`}
        >
            {data.title}
        </p>
    </div>
</a>

<style>
    .manga-item-cover {
        min-height: 232px;
    }
    .manga-title {
        min-height: 28px;
    }
</style>
