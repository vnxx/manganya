<script>
    import { onMount } from "svelte";
    import { Link } from "svelte-navigator";

    export let data;
    export let width = "full";
    export let isSkeletonOnly = false;
    let isImageOnLoad = false;
    let loadedTitle = false;

    function updateLoad() {
        isImageOnLoad = true;
    }

    onMount(() => {
        setTimeout(() => {
            if (!isSkeletonOnly) {
                loadedTitle = true;
            }
        }, 200);
    });
</script>

<Link to={isSkeletonOnly ? "#" : `/manga/${data.slug}`}>
    <div class="flex flex-col h-full" style={`width: ${width}`}>
        <div
            class={`bg-gray-800 overflow-hidden flex rounded-lg aspect-[39/58] w-full h-full ${
                !isImageOnLoad ? "animate-pulse" : "animate-none"
            }`}
        >
            {#if !isSkeletonOnly}
                <img
                    on:load={() => updateLoad()}
                    src={data.cover}
                    alt={data.title}
                    width="100%"
                    class={`transition-all object-cover duration-300 ease-in-out ${
                        isImageOnLoad ? "opacity-100" : "opacity-0"
                    }`}
                />
            {/if}
        </div>

        <div class="mt-3 space-y-1">
            {#if isSkeletonOnly || !(data.lastChapter === null || data.lastUpdate == null)}
                <div style="font-size: 11px;" class="flex justify-between">
                    <div
                        class={`text-main-white flex items-center min-w-[60%] min-h-[20px] rounded-lg ${
                            loadedTitle
                                ? "animate-none bg-none"
                                : "animate-pulse bg-gray-800"
                        }`}
                    >
                        {#if !isSkeletonOnly}
                            <img
                                class="mr-1"
                                style="width: 15px; height: max-content;"
                                src={data.type.image}
                                alt="flag"
                            />
                            {data.lastUpdate}
                        {/if}
                    </div>

                    <span
                        class={`px-2 py-[1px] text-center rounded-md min-w-[30px] ${
                            loadedTitle
                                ? "animate-none bg-secondary"
                                : "animate-pulse bg-gray-800"
                        }`}
                    >
                        {#if !isSkeletonOnly}
                            {data.lastChapter}
                        {/if}
                    </span>
                </div>
            {/if}

            <div
                class={`rounded-lg ${
                    loadedTitle
                        ? "animate-none bg-none"
                        : "animate-pulse bg-gray-800"
                }`}
            >
                <p
                    class={`text-sm w-full min-h-[20px] truncate font-bold transition-all duration-300 ease-in-out ${
                        loadedTitle ? "text-white " : "text-gray-800"
                    }`}
                >
                    {#if !isSkeletonOnly}
                        {data?.title}
                    {/if}
                </p>
            </div>
        </div>
    </div>
</Link>
