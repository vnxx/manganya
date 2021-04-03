<script>
	import Router from "svelte-spa-router";
	import Manga from "./pages/manga.svelte";
	import Home from "./pages/home.svelte";
	import ReadManga from "./pages/readManga.svelte";
</script>

<main>
	<Router
		routes={{
			"/": Home,
			"/manga/:slug": Manga,
			"/manga/:slug/:chapter": ReadManga,
		}}
	/>
</main>

<style global lang="postcss">
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
</style>
