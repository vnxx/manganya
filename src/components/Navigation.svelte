<script>
    import { useNavigate } from "svelte-navigator";
    import { IcnHome, IcnSearch, IcnPlus } from "./Icons.svelte";

    const navigate = useNavigate();
</script>

<nav
    id="navbar"
    class="fixed left-0 flex justify-center items-center bottom-4 w-full z-30 transition-all duration-300 ease-in-out"
>
    <div
        class="flex justify-between w-1/2 xl:w-1/6 p-3 rounded-full bg-gray-800 shadow-md px-4"
    >
        <button
            class="p-1 fill-current rounded-full"
            on:click={() => navigate("/")}
        >
            <IcnHome />
        </button>
        <button
            on:click={() => navigate("/manga/search")}
            class="p-1 fill-current rounded-full"
        >
            <IcnSearch />
        </button>
        <button
            on:click={() => navigate("/manga/favorites")}
            class="p-1 fill-current rounded-full"
        >
            <IcnPlus />
        </button>
    </div>
</nav>
