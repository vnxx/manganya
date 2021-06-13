<script>
	export let isOpen = true;
	export let onClose;
</script>

<div
	on:click={onClose}
	class={`fixed top-0 w-full h-screen z-40 bg-black transition-opacity ${
		isOpen
			? "opacity-50 pointer-events-auto"
			: "opacity-0 pointer-events-none"
	}`}
/>
<nav
	class={`fixed w-full z-50 xl:max-w-5xl ${
		isOpen ? "bottom-0" : "-bottom-full"
	} bg-gray-800 z-30 rounded-tr-xl rounded-tl-xl transition-all duration-300 ease-in-out`}
>
	<slot />
</nav>
