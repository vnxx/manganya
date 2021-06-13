<script>
	import { Router, Route } from "svelte-navigator";
	import Manga from "./pages/manga.svelte";
	import Home from "./pages/home.svelte";
	import ReadManga from "./pages/readManga.svelte";
	import Search from "./pages/search.svelte";
	import Favorite from "./pages/favorite.svelte";
	import InstallationGuide from "./pages/installationGuide.svelte";
</script>

<main>
	<Router primary={false}>
		<Route path="/" component={Home} />
		<Route path="/manga/search" component={Search} />
		<Route path="/manga/favorites" component={Favorite} />
		<Route
			path="/installation-guide"
			component={InstallationGuide}
		/>
		<Route path="/manga/:slug" component={Manga} />
		<Route path="/manga/:slug/:chapter" component={ReadManga} />
	</Router>
</main>

<style global lang="postcss">
	@tailwind base;
	@tailwind components;
	@tailwind utilities;

	html {
		scroll-behavior: smooth;
	}
</style>
