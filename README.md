# Mangaku
Suka baca manga? sebal dengan iklan yang muncul terus-terusan? coba buka [manganya.bykevin.work](https://manganya.bykevin.work/) no iklan-iklan club.

## How to run it locally?
1. `git clone https://github.com/vnxx/mangaku.git`.
2. `cd mangaku`.
3. `npm install`.
4. `npm run dev` - If you want to update the UI.
5. `php -S localhost:8000 -t public/`. Open localhost:8000 instead of localhost:5000 to get the API data, don't worry the hot reload feautre still works.

## How to contribute?
Just like usual way, but before you make a pull request, make sure you have run `npm run build` to generate js and css file for production. Why? Normally build folder/file it is't included, in my case I can't run `npm run build` on my hosting provider (memory not enough). And don't forget to select dev branch as a target branch.

## Why do I build this?
A couples days back, when I heard hataraku maou-sama will get next season (season 2), I rewatch the season 1, and I realise I can't wait for season 2 come up. Short story, because I can't wait for season 2 I decided to read the manga from chapter 20 until 82 and chapter 83 - 93 (english version). But it didn't answer the question why do I build this 🤪. Ok the answer is because when I read the manga I got so many ads pop up on my screen. Get it?

## Why don't I read the legal manga instead?
The answer is because I don't know where to go. this is the ironic thing about this industry (Movies, comics, etc). that it's easier to access the illegal stuff than the legal stuff. if you type on google "Hataraku Maou-sama chapter 82" or anything else when you see the result, what kind of sites you get? the legal or illegal? even though you can find the legal sites how about the <b>payment method?</b>

I'm using Netflix I paid for it each month, I have access to the payment method (debit card), why do I use Netflix instead of the illegal sites? not because Netflix is a is legal site, but it's more like the benefit of using Netflix. if you ask me which one is easier to access I would answer Netflix and the features it's helpful. 

There are three kinds of customers: price-oriented customer, value-oriented customer, and product-oriented consumer. maybe now I'm a value-oriented customer. if the value of the illegal site is more than the legal site, probably I would choose the illegal site because the legal site can't provide my needs.

I believe people who are using this site is a price-oriented customer or even a value-oriented customer.

If you have recommendation legal sites you can dm me I would love to try. what are comics that I read? Hataraku-maou sama, and Solo leveling, just it.

## Why do I use PHP instead of NodeJs?
Because my current plan on my hosting provider doesn't support NodeJs app. And the main reason is PHP is more cheaper.

## Why do I using SvelteJs instead of ReactJs?
I just want to try Svelte, and this is the first time I'm using svelte. 🤔 Not bad.

## Where I get the data?
I got from bacakomik.co, I'm using scarping technique to get the data 👀.

## Do I affiliate with bacakomik.co?
No, I choose bacakomik.co because it's fast and the cors didn't block me. For bacakomik.co I recommend you to limit the cors or use cloudflare 👌🏻.
