<script>
    export let data;
    export let width = "auto";
    let isImageOnLoad = false;

    function updateLoad() {
        setTimeout(() => {
            isImageOnLoad = true;
        }, 200);
    }
</script>

<a href="#/manga/{data.slug}" style={`width: ${width}`}>
    <div
        style={`width: ${width}; height: ${width}`}
        class={`bg-gray-800 overflow-hidden rounded-md ${
            width === "auto" ? "aspect-w-1 aspect-h-1" : null
        } ${!isImageOnLoad ? "animate-pulse" : "animate-none"}`}
    >
        <div>
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
