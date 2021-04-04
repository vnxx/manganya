<script>
    import { push } from "svelte-spa-router";
    import { IcnHome, IcnSearch, IcnPlus } from "./Icons.svelte";
    export let px = 3;
    export let spaceY = 3;
    export let isLayeringHeader = false;
    export let showNav = true;

    var prevScrollpos = window.pageYOffset;
    window.onscroll = function () {
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
    };
</script>

<div class={`max-w-5xl m-auto px-${px} space-y-${spaceY} relative text-white`}>
    <header
        class={isLayeringHeader
            ? "py-6 absolute xl:relative w-full top-0 z-10"
            : "py-6"}
    >
        <h1 class="text-center font-bold text-2xl">
            <a href="/#/">Mangaku</a>
        </h1>
    </header>
    {#if showNav}
        <nav
            id="navbar"
            class="fixed left-0 flex justify-center items-center bottom-4 w-full z-50 transition-all duration-300 ease-in-out"
        >
            <div
                class="flex justify-between w-1/2 xl:w-1/6 p-3 rounded-full bg-gray-800 shadow-md"
            >
                <button
                    class="p-1 fill-current rounded-full"
                    on:click={() => push("/")}
                >
                    <IcnHome />
                </button>
                <button class="p-1 fill-current rounded-full">
                    <IcnSearch />
                </button>
                <button class="p-1 fill-current rounded-full">
                    <IcnPlus />
                </button>
            </div>
        </nav>
    {/if}
    <slot />
</div>
