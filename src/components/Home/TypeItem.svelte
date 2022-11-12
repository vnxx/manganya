<script>
	import { Link } from "svelte-navigator";

	export let currentType;
	export let type;
	export let label;
	export let image;
	export let onClick;
</script>

<Link
	to={`/?type=${type}`}
	class={`transition-colors duration-150 px-4 flex-none items-center py-2 rounded-lg flex ${
		currentType === type ? "bg-main-red" : "bg-secondary"
	}`}
	on:click={onClick}
>
	{#if image}
		<img class="mr-2 w-[20px] h-fit" src={image} alt="" />
	{/if}
	{label}
</Link>
