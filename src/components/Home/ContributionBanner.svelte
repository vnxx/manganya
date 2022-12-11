<script>
	import Button from "../Button.svelte";

	import { getScreenCounter, isScreenCounting } from "../../lib/helper";

	let isShowContributorBanner = false;
	if (isScreenCounting()) {
		if (
			getScreenCounter() > 30 &&
			localStorage.getItem("isShowContributorBanner") !==
				"false"
		) {
			isShowContributorBanner = true;
		}
	}

	const hideBanner = () => {
		localStorage.setItem("isShowContributorBanner", "false");
		isShowContributorBanner = false;
	};

	let isContributionLinkClicked =
		localStorage.getItem("isContributionLinkClicked") === "true";
	const onClick = () => {
		localStorage.setItem("isContributionLinkClicked", "true");
		isContributionLinkClicked = true;

		window.open("https://forms.gle/jYYwY7b86LwiFHuz7", "_blank");
	};
</script>

{#if isShowContributorBanner}
	<section class="bg-secondary p-6 rounded-lg space-y-3">
		<h2 class="text-xl font-bold">Kamu suka baca di Manganya?</h2>
		<div class="text-sm leading-6 space-y-2">
			<p>
				Hallo, pesan ini akan muncul untuk kamu yang
				lebih dari 30x kali buka aplikasi manganya.
			</p>
			<p>
				Perkenalkan saya K yang buat aplikasi ini,
				apakah kamu tertarik dengan sistem atau fitur
				Akun di aplikasi manganya? Sehingga kamu bisa
				simpan history komik kamu dan mengaksesnya dari
				device apapun.
			</p>
		</div>

		<div class="pt-6 space-y-3">
			<Button class="" theme="red" onclick={onClick}
				>{isContributionLinkClicked
					? "Buka Linknya Kembali"
					: "Saya Tertarik"}</Button
			>
			<Button class="" onclick={hideBanner}>
				{isContributionLinkClicked
					? "Tutup Banner"
					: "Saya Tidak Tertarik"}
			</Button>
		</div>
	</section>
{/if}
