<?php

namespace Api;

require __DIR__ . '/../Services/Http.php';

class MangaController
{
    private function _getMangaItems(
        $source,
        $coverRegexCode = '/<div class="animposx">\n.*[^.*]*img src="(.*)" title/',
        $titleRegexCode = '/<div class="tt"> <h4>(.*)<\/h4>/',
        $slugRegexCode = '/<div class="animposx">\n.*href=".*komik\/(.*)\/" item/',
        $typeRegexCode = '/<span class="typeflag (.*)">/',
        $lastUpdateRegexCode = '/<div class="datech">(.*)<\//',
        $lastChapter = '/">Chapter (.*)<\/a/'
    ): array {
        preg_match_all($coverRegexCode, $source, $covers);
        preg_match_all($titleRegexCode, $source, $titles);
        preg_match_all($slugRegexCode, $source, $slugs);
        preg_match_all($typeRegexCode, $source, $types);
        preg_match_all($lastUpdateRegexCode, $source, $lastUpdates);
        preg_match_all($lastChapter, $source, $lastChapters);

        $data = [];
        foreach ($titles[1] as $key => $title) {
            array_push($data, [
                'title' => $title,
                'cover' => $covers[1][$key] . '.jpg',
                'slug' => $slugs[1][$key],
                'type' => [
                    'name' => strtolower($types[1][$key]),
                    'image' => getenv("APP_URL") . '/assets/' . strtolower($types[1][$key]) . '.jpeg'
                ],
                'lastUpdate' => $lastUpdates[1][$key] ?? null,
                'lastChapter' => $lastChapters[1][$key] ?? null
            ]);
        }

        return $data;
    }

    public function index()
    {
        $type = strtolower(isset($_GET['type']) ? $_GET['type'] : 'all');
        switch ($type) {
            case 'manhua':
                $source = Http::get('https://bacakomik.co/manhua/');
                break;
            case 'manhwa':
                $source = Http::get('https://bacakomik.co/manhwa/');
                break;
            case 'manga':
                $source = Http::get('https://bacakomik.co/daftar-manga/');
                break;
            default:
                $source = Http::get('https://bacakomik.co/komik-terbaru');
                break;
        }

        if (!$source->isSuccess()) {
            return $source->showError();
        }

        if (in_array($type, ['manhua', 'manhwa'])) {
            $data = $this->_getMangaItems(
                source: $source->response(),
                coverRegexCode: '/n><img src="(.*)" tit/',
                titleRegexCode: "/class='tt'>(.*)<\/div/",
                slugRegexCode: "/href='.*komik\/(.*)\/'/",
                typeRegexCode: "/<span class='typeflag (.*)'>/",
            );
        } else {
            $data =  $this->_getMangaItems($source->response());
        }

        return [
            'status' => 'SUCCESS',
            "data" => $data,
        ];
    }

    public function search()
    {
        $search = isset($_GET['search']) ?  $_GET['search'] : null;
        if ($search) {
            $source = Http::get('https://bacakomik.co/?s=' . str_replace(' ', '+', $search));

            if (!$source->isSuccess()) {
                return $source->showError();
            }
        }

        return [
            'status' => 'SUCCESS',
            'query' => $search,
            'data' => $search ? $this->_getMangaItems($source->response()) : [],
        ];
    }

    public function show($slug)
    {
        $source = Http::get('https://bacakomik.co/komik/' . $slug . '/');

        if (!$source->isSuccess()) {
            return $source->showError();
        }

        preg_match_all('/lchx.*<a href=".*chapter-(.*)-bah/', $source->response(), $chapters);
        preg_match('/entry-title".*">(.*)</', $source->response(), $title);
        preg_match('/<div class="thumb" itemprop="image" .*\n.*src="(.*)" tit/', $source->response(), $cover);
        preg_match('/description">\n.*<p>(.*[^<]*)<\/p>/', $source->response(), $sinopsis);
        preg_match('/enis Komik:.*">(.*?(?=<))/', $source->response(), $type);
        preg_match('/Status:.*b> (.*)<\/sp/', $source->response(), $status);
        preg_match('/Dirilis:.*> (.*)<\/span/', $source->response(), $releaseYear);
        preg_match('/Dilihat:.*> (.*)</', $source->response(), $views);

        return [
            "status" => 'SUCCESS',
            "data" => [
                "title" => $title[1],
                "cover" => $cover[1],
                "sinopsis" => str_replace('&nbsp;', '', trim(preg_replace('/\s\s+/', ' ', strip_tags($sinopsis[1])))),
                "chapters" => $chapters[1],
                "type" => [
                    "name" => strtolower($type[1]),
                    "image" => getenv("APP_URL") . '/assets/' . strtolower($type[1]) . '.jpeg'
                ],
                "status" => $status[1],
                "releaseYear" => $releaseYear[1],
                "views" => $views[1],
            ]
        ];
    }

    public function showChapter($slug, $chapter)
    {
        $source = Http::get('https://bacakomik.co/chapter/' . $slug . '-chapter-' . $chapter . '-bahasa-indonesia/');

        if (!$source->isSuccess()) {
            return $source->showError();
        }

        preg_match('/<div class="thumb" itemprop="image" .*\n.*src="(.*)" tit/', $source->response(), $cover);
        preg_match('/<a href=".*chapter-(.*)-ba.*rel="prev/', $source->response(), $prev);
        preg_match('/<a href=".*chapter-(.*)-ba.*rel="next/', $source->response(), $next);
        preg_match_all('/<img src="(.*?(?="))" alt.*?(?=Chapter)/', $source->response(), $mainImages);
        preg_match_all("/this.src='(.*?(?='))/", $source->response(), $backupIamges);

        $source2 = Http::get('https://bacakomik.co/komik/' . $slug . '/');
        preg_match('/entry-title".*">(.*)</', $source2->response(), $title);
        preg_match_all('/lchx.*<a href=".*chapter-(.*)-bah/', $source2->response(), $chapters);

        if (!$source2->isSuccess()) {
            return $source->showError();
        }

        $images = [];

        foreach ($mainImages[1] as $key => $image) {
            array_push($images, [
                'main_url' => $image,
                'backup_url' => $backupIamges[1][$key]
            ]);
        }

        return [
            'status' => 'SUCCESS',
            'data' => [
                'title' => $title[1],
                'slug'  => $slug,
                'chapter' => $chapter,
                'cover' => $cover[1],
                'chapters' => $chapters[1],
                'current' => $chapter,
                'next' => count($next) > 0 ? $next[1] : null,
                'prev' => count($prev) > 0 ? $prev[1] : null,
                'data' => $images,
            ]
        ];
    }
}
