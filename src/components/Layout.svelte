<script>
    import Navigation from "../components/Navigation.svelte";

    export let px = 3;
    export let spaceY = 3;
    export let isLayeringHeader = false;
    export let showNav = true;
    export let myClass = null;

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

<div class={`max-w-5xl m-auto px-${px} relative text-white ${myClass}`}>
    <header
        class={isLayeringHeader
            ? "py-6 absolute xl:relative w-full top-0 z-10"
            : "py-6 relative z-10"}
    >
        <h1 class="text-center font-bold text-2xl">
            <a href="/#/">Manganya</a>
        </h1>
    </header>
    {#if showNav}
        <Navigation />
    {/if}
    <div class={`space-y-${spaceY}`}>
        <slot />
    </div>
</div>
