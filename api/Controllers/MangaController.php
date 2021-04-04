<?php

namespace Api;

require __DIR__ . '/../Services/Http.php';

class MangaController
{
    public function index()
    {
        $source = Http::get('https://komikcast.com/daftar-komik/?orderby=update');

        preg_match_all('/class="list-update_item">\n.*\n.*\n.*\n.*\n.*\n.*\n.*\n.*src="(.*).jpg/', $source, $covers);
        preg_match_all('/class="list-update_item-info">\n.*;">(.*)<\/div>/', $source, $titles);
        preg_match_all('/class="list-update_item">\n.*href=".*komik\/(.*)\/" title/', $source, $slugs);

        $data = [];

        foreach ($titles[1] as $key => $title) {
            array_push($data, [
                'title' => $title,
                'cover' => $covers[1][$key] . '.jpg',
                'slug' => $slugs[1][$key],
            ]);
        }

        return [
            "data" => $data
        ];
    }

    public function show($slug)
    {
        $source = Http::get('https://komikcast.com/komik/' . $slug . '/');
        preg_match_all('/chapter-link-item.*chapter-(.*?(?=-))/', $source, $chapters);
        preg_match('/class="komik_info-content-body-title">(.*)<\/h1/', $source, $title);
        preg_match('/class="komik_info-content-thumbnail".*\n.*src="(.*)" class="/', $source, $cover);
        preg_match('/itemprop="articleBody">\s*([^*]*<\/p>)/', $source, $sinopsis);

        return [
            "title" => $title[1],
            "cover" => $cover[1],
            "sinopsis" => str_replace('&nbsp;', '', trim(preg_replace('/\s\s+/', ' ', strip_tags($sinopsis[1])))),
            "chapters" => $chapters[1]
        ];
    }

    public function showChapter($slug, $chapter)
    {
        $source = Http::get('https://komikcast.com/chapter/' . $slug . '-chapter-' . $chapter . '-bahasa-indonesia/');
        preg_match('/<h1 itemprop="name">(.*)<\/h1>/', $source, $title);
        preg_match('/nextprev">\n.*<a href=".*chapter-(.*)-b.*rel="prev/', $source, $prev);
        preg_match('/nextprev">\n.*<a href=".*chapter-(.*)-b.*rel="next/', $source, $next);
        preg_match('/<div class="main-reading-area">\n(\s*.[^*]*)<div class="chapter_nav/', $source, $images);
        preg_match_all('/<img src="(.*)" alt/', $images[1], $data);
        preg_match_all('/<option value.*chapter-(.*)-b/', $source, $chapters);

        $chapters = array_unique($chapters[1]);

        $data = array_map(function ($val) {
            return str_replace('https://cdn', 'https://cdn.statically.io/img/kcast/cdn-image', str_replace(' ', '%20', $val));
        }, $data[1]);

        return [
            'title' => $title[1],
            'chapter' => $chapter,
            'chapters' => $chapters,
            'next' => count($next) > 0 ? $next[1] : null,
            'prev' => count($prev) > 0 ? $prev[1] : null,
            'data' => $data,
        ];
    }
}
