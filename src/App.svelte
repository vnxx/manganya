<script>
  import { Router, Route } from "svelte-navigator";
  import Manga from "../src/pages/manga.svelte";
  import Home from "../src/pages/home.svelte";
  import ReadManga from "../src/pages/readManga.svelte";
  import Search from "../src/pages/search.svelte";
  import Favorite from "../src/pages/favorite.svelte";
  import InstallationGuide from "../src/pages/installationGuide.svelte";

  import { getScreenCounter, isScreenCounting } from "./lib/helper";

  if (isScreenCounting()) {
    let screenCounter = getScreenCounter();
    if (screenCounter === 0) {
      localStorage.setItem(
        "screenCounterInitAt",
        new Date().getTime().toString()
      );
    }
    screenCounter++;
    localStorage.setItem("screenCounter", screenCounter.toString());
  }
</script>

<main>
  <Router primary={false}>
    <Route path="/" component={Home} />
    <Route path="/manga/search" component={Search} />
    <Route path="/manga/favorites" component={Favorite} />
    <Route path="/installation-guide" component={InstallationGuide} />
    <Route path="/manga/:slug" component={Manga} />
    <Route path="/manga/:slug/:chapter" component={ReadManga} />
  </Router>
</main>
