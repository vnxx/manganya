<script>
    import { push } from "svelte-spa-router";
    import { IcnHome, IcnSearch, IcnPlus } from "./Icons.svelte";
</script>

<nav
    id="navbar"
    class="fixed left-0 flex justify-center items-center bottom-4 w-full z-30 transition-all duration-300 ease-in-out"
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
        <button
            on:click={() => push("/manga/search")}
            class="p-1 fill-current rounded-full"
        >
            <IcnSearch />
        </button>
        <button class="p-1 fill-current rounded-full">
            <IcnPlus />
        </button>
    </div>
</nav>
