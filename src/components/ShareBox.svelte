<script>
	import DrawerBox from "./DrawerBox.svelte";
	export let isOpen = true;
	export let url = window.location.href;
	export let onClose;
	let hasCopied = false;

	function copyToClipboard() {
		navigator.clipboard.writeText(url).then(function () {
			hasCopied = true;
			setTimeout(() => {
				hasCopied = false;
			}, 2000);
		});

		setTimeout(() => {
			onClose();
		}, 300);
	}
</script>

<DrawerBox {isOpen} {onClose}>
	<div class="p-5 text-white pb-12">
		<p class="font-bold mb-3">Share</p>
		<div class="space-y-3">
			<div class="space-x-3">
				<button
					class="py-1 px-5 rounded-full bg-blue-900"
					on:click={() =>
						window.open(
							`https://www.facebook.com/sharer/sharer.php?u=${url}`,
							"_blank"
						)}>Facebook</button
				>
				<button
					class="py-1 px-5 rounded-full bg-green-700"
					on:click={() =>
						window.open(
							`https://wa.me/?text=${url}`,
							"_blank"
						)}>WhatsApp</button
				>
			</div>
			<div class="space-x-3">
				<button
					class="py-1 px-5 rounded-full bg-blue-500"
					on:click={window.open(
						`https://twitter.com/intent/tweet?text=${url}`,
						"_blank"
					)}>Twitter</button
				>
				<button
					class="py-1 px-5 rounded-full bg-blue-800"
					on:click={window.open(
						`fb-messenger://share/?link=${url}`,
						"_blank"
					)}>Messenger</button
				>
			</div>
			<div class="space-x-4">
				<button
					class="py-1 px-5 rounded-full bg-gray-600"
					on:click={() => copyToClipboard()}
					>{hasCopied
						? "Link telah disalin"
						: "Salin Link"}</button
				>
			</div>
		</div>
	</div>
</DrawerBox>
