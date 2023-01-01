<script>
    // @ts-nocheck

    import Layout from "../components/Layout.svelte";
    import { onMount } from "svelte";
    import Loading from "../components/Loading.svelte";
    import { useEffect } from "../components/hook";
    import { useNavigate } from "svelte-navigator";
    import ErrorResponse from "../components/ErrorResponse.svelte";
    import {
        IcnArrowLeft,
        IcnArrowRight,
        IcnClose,
        IcnHome,
        IcnShare,
    } from "../components/Icons.svelte";
    import ChapterItem from "../components/ChapterItem.svelte";
    import DrawerBox from "../components/DrawerBox.svelte";
    import ShareBox from "../components/ShareBox.svelte";

    const api_url = import.meta.env.VITE_API_URL;

    export let slug;
    export let chapter;
    let dataset;
    let loadedImages = 0;
    let loading = true;
    let error = null;
    let isImageError = false;
    let isChapterBarOpen = false;
    let inHistory = null;
    let isShareBarOpen = false;
    let InHistories = [];
    var prevScrollpos = window.pageYOffset;
    let updateYoffset = 0;

    function shareNow() {
        isChapterBarOpen = false;
        isShareBarOpen = true;
    }

    const navigate = useNavigate();

    onMount(async () => {
        call(chapter, false);
    });

    onMount(() => {
        window.addEventListener("scroll", function () {
            var currentScrollPos = window.pageYOffset;
            var nav = document.getElementById("navbar");
            if (nav) {
                if (prevScrollpos > currentScrollPos) {
                    nav.classList.add("bottom-4");
                    nav.classList.remove("-bottom-20");
                } else {
                    nav.classList.add("-bottom-20");
                    nav.classList.remove("bottom-4");
                }
                prevScrollpos = currentScrollPos;
            }
            //  update inHistory
            if (
                inHistory &&
                window.location.href ===
                    window.location.origin + "/manga/" + slug + "/" + chapter
            ) {
                inHistory.pageYOffset = currentScrollPos;
                InHistories[
                    InHistories.findIndex((x) => x.slug === inHistory.slug)
                ] = inHistory;
                localStorage.setItem("histories", JSON.stringify(InHistories));
            }
        });
    });

    useEffect(
        () => {
            if (dataset) {
                if (dataset.data.length === loadedImages) {
                    if (inHistory.history.current_chapter === chapter) {
                        setTimeout(() => {
                            window.scrollTo(0, updateYoffset);
                        }, 600);
                    }
                }
            }
        },
        () => [loadedImages]
    );

    useEffect(
        () => {
            if (isImageError) {
                isImageError = false;
                // console.log(dataset.source);
                let newwindow = window.open(
                    dataset.source,
                    "anyname",
                    "height=200,width=150"
                );
                setTimeout(() => {
                    newwindow.close();
                }, 2500);
            }
        },
        () => [isImageError]
    );

    async function call(chapter, rplc = true) {
        loading = true;
        isImageError = false;
        loadedImages = 0;
        window.scrollTo(0, 0);
        updateYoffset = 0;
        if (rplc) {
            navigate(`/manga/${slug}/${chapter}`);
        }

        await fetch(`${api_url}/manga/${slug}/${chapter}`)
            .then((r) => r.json())
            .then((data) => {
                if (data.status == "SUCCESS") {
                    dataset = data.data;
                    //  update hitory
                    let histories = JSON.parse(
                        localStorage.getItem("histories")
                    );
                    histories = histories ? histories : [];

                    let exitingManga = histories.filter(
                        (val) => val.slug === slug
                    );

                    if (exitingManga.length > 0) {
                        //  update exiting manga
                        histories = histories.filter(
                            (val) => val.slug !== dataset.slug
                        );
                        exitingManga = exitingManga[0];

                        //  update y offset if chapter same before update chapter
                        if (exitingManga.history.current_chapter === chapter) {
                            updateYoffset = exitingManga.pageYOffset;
                        }

                        exitingManga.title = dataset.title;
                        exitingManga.cover = dataset.cover;
                        exitingManga.history.previous_chapter = dataset.prev;
                        exitingManga.history.current_chapter = dataset.current;
                        exitingManga.history.next_chapter = dataset.next;

                        if (
                            exitingManga.history.chapters.filter(
                                (val) => val === chapter
                            ).length === 0
                        ) {
                            exitingManga.history.chapters.unshift(chapter);
                        }

                        histories.unshift(exitingManga);
                    } else {
                        //  add new manga to history
                        exitingManga = {
                            title: dataset.title,
                            slug: dataset.slug,
                            cover: dataset.cover,
                            pageYOffset: 0,
                            history: {
                                previous_chapter: dataset.prev,
                                current_chapter: dataset.current,
                                next_chapter: dataset.next,
                                chapters: [dataset.chapter],
                            },
                        };

                        histories.unshift(exitingManga);
                    }

                    inHistory = exitingManga;
                    InHistories = histories;
                    localStorage.setItem(
                        "histories",
                        JSON.stringify(histories)
                    );
                } else {
                    error = data;
                }

                dataset = data.data;
                loading = false;
            });
    }
</script>

<Loading isLoading={loading} />

{#if !loading}
    <ShareBox
        isOpen={isShareBarOpen}
        onClose={() => (isShareBarOpen = false)}
    />
    <Layout title="Read Manga" px="0" showNav={false}>
        {#if error != null}
            <ErrorResponse {error} />
        {:else}
            <div
                class={`absolute justify-center w-full text-gray-900 flex content-center items-center z-10 transition-all duration-300 ease-in-out `}
            >
                <div
                    class={`m-auto fixed px-5 py-2 bg-white rounded-full text-xs shadow-xl ${
                        loadedImages === dataset.data.length
                            ? "opacity-0 -bottom-10"
                            : "opacity-100 bottom-24"
                    }`}
                >
                    Loaded: {loadedImages}/{dataset.data.length}
                </div>
            </div>
            <h1 class="text-3xl text-center px-3 font-bold">
                {dataset.title}
            </h1>
            <section>
                <div class="m-auto w-full">
                    {#each dataset.data as url, i}
                        <img
                            on:load={() => (loadedImages = loadedImages + 1)}
                            on:error={(e) => {
                                e.target.src = url.backup_url;
                                isImageError = true;
                            }}
                            class="w-full"
                            src={url.backup_url}
                            alt={`${dataset.title}-image-${i + 1}`}
                        />
                    {/each}
                </div>
                <button
                    on:click={() => window.scrollTo(0, 0)}
                    class="p-3 w-full bg-gray-800 text-white fill-current"
                    ><IcnArrowLeft class="transform rotate-90 m-auto" /></button
                >
            </section>

            <nav
                id="navbar"
                class="fixed left-0 flex justify-center items-center bottom-4 w-full z-10 transition-all duration-300 ease-in-out text-white"
            >
                <div
                    class="flex justify-between w-[250px] p-3 rounded-full border border-secondary backdrop-blur-sm bg-primary/60 shadow-md px-4"
                >
                    {#if dataset.prev}
                        <button
                            class="fill-current rounded-full"
                            on:click={call(dataset.prev)}
                        >
                            <IcnArrowLeft />
                        </button>
                    {/if}
                    <button
                        on:click={() => (isChapterBarOpen = !isChapterBarOpen)}
                        class="fill-current rounded-full"
                    >
                        {chapter}
                    </button>
                    {#if dataset.next}
                        <button
                            on:click={call(dataset.next)}
                            class="fill-current rounded-full"
                        >
                            <IcnArrowRight />
                        </button>
                    {/if}
                </div>
            </nav>
        {/if}
    </Layout>

    <DrawerBox
        onClose={() => (isChapterBarOpen = false)}
        isOpen={isChapterBarOpen}
    >
        <div class="p-5 space-y-3 text-white">
            <h2 class="text-center font-bold text-lg">Pilih Chapter</h2>
            <div class="overflow-y-auto max-h-96">
                <div class="grid grid-cols-5 xl:grid-cols-12 gap-3">
                    {#each dataset.chapters as item_chapter}
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <div on:click={call(item_chapter)}>
                            <ChapterItem
                                isSelected={item_chapter === chapter}
                                chapter={item_chapter}
                                {slug}>{item_chapter}</ChapterItem
                            >
                        </div>
                    {/each}
                </div>
            </div>
            <button
                class="p-1 fill-current w-full flex items-center justify-center"
                on:click={() => navigate("/")}><IcnHome /></button
            >
            <button
                class="text-center w-full"
                on:click={() => navigate("/manga/" + dataset.slug)}
                >{dataset.title}</button
            >
            <button
                class="p-1 fill-current w-full flex items-center justify-center"
                on:click={() => shareNow()}><IcnShare /></button
            >
            <button
                class="p-1 fill-current w-full flex items-center justify-center"
                on:click={() => (isChapterBarOpen = !isChapterBarOpen)}
                ><IcnClose /></button
            >
        </div>
    </DrawerBox>
{/if}
