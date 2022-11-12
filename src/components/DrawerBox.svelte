<script>
	export let isOpen = true;
	export let onClose;
</script>

<div id="drawer" class="flex justify-center">
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div
		style="z-index: 10;"
		on:click={onClose}
		class={`absolute w-full h-full top-0 bg-black transition-opacity ${
			isOpen
				? "opacity-50 pointer-events-auto"
				: "opacity-0 pointer-events-none"
		}`}
	/>
	<nav
		class={`fixed w-full z-50 xl:max-w-5xl ${
			isOpen ? "bottom-0" : "-bottom-full"
		} border-secondary backdrop-blur-sm bg-primary/60 z-30 rounded-tr-xl rounded-tl-xl transition-all duration-300 ease-in-out`}
	>
		<slot />
	</nav>
</div>
