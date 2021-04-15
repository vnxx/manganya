<?php

namespace Api;

require __DIR__ . '/../Services/Http.php';

class MangaController
{
    public function index()
    {
        $source = Http::get('https://komikav.com/manga/?order=update');

        preg_match_all('/<span class="type.*src="(.*)" cl/', $source, $covers);
        preg_match_all('/<div class="tt">.*\n(.*)</', $source, $titles);
        preg_match_all('/bsx">\n.*\n.*href=".*manga\/(.*)\//', $source, $slugs);

        $data = [];

        foreach ($titles[1] as $key => $title) {
            array_push($data, [
                'title' => $title,
                'cover' => $covers[1][$key],
                'slug' => $slugs[1][$key],
            ]);
        }

        return [
            "data" => $data
        ];
    }

    public function search()
    {
        $search = isset($_GET['search']) ?  $_GET['search'] : null;
        $data = [];

        if ($search) {
            $source = Http::get('https://bacakomik.co/?s=' . str_replace(' ', '+', $search));

            preg_match_all('/<div class="animposx">\n.*[^.*]*img src="(.*)" alt/', $source, $covers);
            preg_match_all('/<div class="tt"> <h4>(.*)<\/h4>/', $source, $titles);
            preg_match_all('/<div class="animposx">\n.*href=".*komik\/(.*)\/" item/', $source, $slugs);

            foreach ($titles[1] as $key => $title) {
                array_push($data, [
                    'title' => $title,
                    'cover' => $covers[1][$key] . '.jpg',
                    'slug' => $slugs[1][$key],
                ]);
            }
        }

        return [
            'query' => $search,
            'data' => $data
        ];
    }

    public function show($slug)
    {
        $source = Http::get('https://komikav.com/manga/' . $slug . '/');
        preg_match_all('/data-num="(.*)">/', $source, $chapters);
        preg_match('/entry-title".*">(.*)</', $source, $title);
        preg_match('/<div class="thumb" itemprop="image" .*\n.*src="(.*?(?="))/', $source, $cover);
        preg_match('/description"><p>(.*[^<]*)<\/p>/', $source, $sinopsis);

        return [
            "title" => $title[1],
            "cover" => $cover[1],
            "sinopsis" => str_replace('&nbsp;', '', trim(preg_replace('/\s\s+/', ' ', strip_tags($sinopsis[1])))),
            "chapters" => $chapters[1]
        ];
    }

    public function showChapter($slug, $chapter)
    {
        $source = Http::get('https://komikav.com/' . $slug . '-chapter-' . $chapter . '-bahasa-indonesia/');
        $source2 = Http::get('https://komikav.com/manga/' . $slug . '/');

        preg_match('/<div class="thumb" itemprop="image" .*\n.*src="(.*?(?="))/', $source2, $cover);
        preg_match('/entry-title".*">(.*)</', $source2, $title);
        preg_match('/prevUrl":".*?(?<=chapter-)(.*?(?=-bah))/', $source, $prev);
        preg_match('/nextUrl":".*?(?<=chapter-)(.*?(?=-bah))/', $source, $next);
        preg_match('/{"source":"Server 2","images":.(.*)]}]/', $source, $mainImages);
        preg_match_all('/"(http.*?(?="))/', $mainImages[1], $mainImages);

        // preg_match_all("/this.src='(.*?(?='))/", $source, $backupIamges);

        preg_match_all('/data-num="(.*)">/', $source2, $chapters);

        $mainImages[1] = array_map(function ($data) {
            return str_replace('\/', '/', $data);
        },  (array)$mainImages[1]);

        $images = [];

        foreach ($mainImages[1] as $image) {
            array_push($images, [
                'main_url' => $image,
                'backup_url' => ''
            ]);
        }

        return [
            'title' => $title[1],
            'slug'  => $slug,
            'chapter' => $chapter,
            'cover' => $cover[1],
            'chapters' => $chapters[1],
            'current' => $chapter,
            'next' => count($next) > 0 ? $next[1] : null,
            'prev' => count($prev) > 0 ? $prev[1] : null,
            'data' => $images,
        ];
    }
}
