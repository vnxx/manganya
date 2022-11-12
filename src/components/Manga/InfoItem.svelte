<script>
	import { IcnOutlineCalendar } from "../Icons.svelte";

	export let icon;
	export let label = "Last Update";
	export let value = null;
</script>

<div class="p-3 bg-secondary rounded-lg w-[120px] flex-none">
	<div class="h-[70px]">
		<!-- <Icon class="w-[40px]" /> -->
		<svelte:component this={icon} class="w-[40px]" />
	</div>

	<p class="text-main-white text-sm mb-1">{label}</p>
	<p>{value}</p>
</div>
