<script>
    import Layout from "../components/Layout.svelte";
    import Footer from "../components/Footer.svelte";
</script>

<Layout spaceY="10">
    <section>
        <h2 class="font-bold text-2xl mb-3">Download For Android</h2>
        <div class="space-y-5">
            <p>
                Aplikasi berbentuk PWA sehingga dapat diinstall layaknya
                aplikasi andorid pada umumnya.
            </p>
            <div class="flex">
                <div class="h-auto w-3 rounded-full bg-white mr-3" />
                <p class="text-sm">
                    Aplikasi tidak tersedia di Google PlayStore untuk
                    mempermudah proses development. Jika menemukan aplikasi yang
                    serupa itu bukan official dari Manganya.
                </p>
            </div>
            <button
                on:click={() =>
                    window.open(
                        "https://drive.google.com/file/d/1pwYrVjlf2mJAqqFZm4qLKQW6kxvusYyF/view?usp=sharing",
                        "_blank"
                    )}
                class="p-2 px-12 font-bold bg-white text-gray-900 rounded-full"
                >Download</button
            >
        </div>
    </section>
    <section>
        <h2 class="font-bold text-2xl mb-3">Download For IOS</h2>
        <div class="space-y-5">
            <p>
                Aplikasi berbentuk PWA sehingga dapat diinstall layaknya
                aplikasi IOS pada umumnya.
            </p>
            <div class="flex">
                <div class="h-auto w-3 rounded-full bg-white mr-3" />
                <p class="text-sm">
                    Aplikasi tidak tersedia di App Store untuk mempermudah
                    proses development. Jika menemukan aplikasi yang serupa itu
                    bukan official dari Manganya.
                </p>
            </div>
            <p>
                Untuk dapat memasang aplikasi Manganya di Iphone, pastikan kamu
                buka situs manganya di Safari, lalu buka pengatuan kemudian
                pilih <b>“Add To Home Screen”</b> di bawah
                <b>"Add Bookmark"</b>.
            </p>
        </div>
    </section>

    <Footer />
    <div class=" h-5" />
</Layout>
