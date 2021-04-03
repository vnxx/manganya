<script>
    export let data;
</script>

<a href="#/manga/{data.slug}">
    <div class="manga-item-cover">
        <img src={data.cover} alt={data.title} width="100%" />
    </div>
    <div>
        <p class="text-lg truncate font-bold text-white">
            {data.title}
        </p>
    </div>
</a>

<style>
    .manga-item-cover {
        min-height: 200px;
    }
</style>
