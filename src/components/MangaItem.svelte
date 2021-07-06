<script>
    import { onMount } from "svelte";

    import { Link } from "svelte-navigator";
    export let data;
    export let width = "auto";
    let isImageOnLoad = false;
    let loadedTitle = false;

    function updateLoad() {
        isImageOnLoad = true;
    }

    onMount(() => {
        setTimeout(() => {
            loadedTitle = true;
        }, 200);
    });
</script>

<Link to={`/manga/${data.slug}`}>
    <div style={`width: ${width}`}>
        <div
            style={`width: ${width}; height: ${width}`}
            class={`bg-gray-800 overflow-hidden rounded-md ${
                width === "auto" ? "aspect-w-1 aspect-h-1" : null
            } ${!isImageOnLoad ? "animate-pulse" : "animate-none"}`}
        >
            <div>
                <img
                    on:load={() => updateLoad()}
                    src={data.cover}
                    alt={data.title}
                    width="100%"
                    class={`transition-all duration-300 ease-in-out ${
                        isImageOnLoad ? "opacity-100" : "opacity-0"
                    }`}
                />
            </div>
        </div>
        <div
            class={`mt-3 rounded-md ${
                loadedTitle
                    ? "animate-none bg-none"
                    : "animate-pulse bg-gray-800"
            }`}
        >
            <p
                class={`text-lg w-full truncate font-bold transition-all duration-300 ease-in-out ${
                    loadedTitle ? "text-white " : "text-gray-800"
                }`}
            >
                {data.title}
            </p>
        </div>
    </div>
</Link>
