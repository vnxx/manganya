<script>
    import { Link } from "svelte-navigator";
    import Navigation from "../components/Navigation.svelte";

    export let px = 5;
    export let slotClass = null;
    export let isLayeringHeader = false;
    export let showNav = true;
    export let myClass = null;
    export let title = "";

    if (typeof gtag !== "undefined") {
        gtag("event", "page_view", {
            page_title: title,
            page_location: window.location.href,
            page_path: window.location.hash.slice(1),
            send_to: "G-ZGHVTN46GS",
        });
    }

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

<div
    class={`max-w-5xl m-auto relativ text-white ${
        isLayeringHeader ? "mb-0" : "mb-8"
    }`}
>
    <header
        class={isLayeringHeader
            ? "py-6 absolute xl:relative w-full top-0 z-10"
            : "py-6 relative z-10"}
    >
        <h1 class="text-center font-bold outline-none">
            <Link to="/">
                <div class="inline-flex">
                    <img class="logo mr-3" src="/logo-white.png" alt="logo" />
                    <span class="text-xl">Manganya</span>
                </div>
            </Link>
        </h1>
    </header>
</div>
{#if showNav}
    <Navigation />
{/if}
<div class={`max-w-5xl pb-12 m-auto px-${px} relative text-white ${myClass}`}>
    <div class={`main-caontainer ${slotClass ? slotClass : "space-y-10"}`}>
        <slot />
    </div>
</div>

<style>
    .logo {
        width: 25px;
        height: fit-content;
    }
</style>
