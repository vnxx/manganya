# Mangaku
Suka baca manga? sebal dengan iklan yang muncul terus-terusan? coba buka [mangaku.bykevin.work](https://mangaku.bykevin.work/) no iklan-iklan club.

## How to run it locally?
1. `git clone https://github.com/vnxx/mangaku.git`.
2. `cd mangaku`.
3. `npm install`.
4. `npm run dev` - If you want to update the UI.
5. `php -S localhost:8000 -t public/`. Open localhost:8000 instead of localhost:5000 from svelte to get the API data, don't worry the hot reload feautre still works.

## How to contribute?
Just like usual way, but before you make a pull request, make sure you have run `npm run build` to generate js and css file for production. Why? Normally build folder/file it is't included, in my case I can't run `npm run build` on my hosting provider (memory not enough). And don't forget to select dev branch as a target branch.

## Why do I build this?
A couples days back, when I heard hataraku maou-sama will get next season (season 2), I rewatch the season 1, and I realise I can't wait for season 2 come up. Short story, because I can't wait for season 2 I decided to read the manga from chapter 20 until 82 and chapter 83 - 93 (english version). But it didn't answer the question why do I build this 🤪. Ok the answer is because when I read the manga I got so many ads pop up on my screen. Get it?

## Why do I use PHP instead of NodeJs?
Because my current plan on my hosting provider doesn't support NodeJs app. And the main reason is PHP is more cheaper.

## Why do I using SvelteJs instead of ReactJs?
I just want to try Svelte, and this is the first time I'm using svelte. 🤔 Not bad.

## Where I get the data?
I got from komikcast, I'm using scarping technique to get the data 👀.

## Do I affiliate with komikcast?
No, I choose komikcast because it's fast and the cors didn't block me. For komikcast I recommend you to try using cors or maybe cloudflare 👌🏻. But if komikcast want to buy my code for open new business model, you know how to contact me 😉.
