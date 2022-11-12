<script>
	let clazz;
	export let isLoading = true;
	export { clazz as class };
</script>

<div
	class={`animate-pulse bg-gray-800 w-12 h-3 ${
		isLoading ? "animate-none bg-none" : "animate-pulse bg-gray-800"
	} ${clazz}`}
>
	<slot />
</div>
