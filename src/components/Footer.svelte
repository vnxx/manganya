<script>
    import { IcnGitHub, IcnInstagram } from "./Icons.svelte";
    let clazz = "";
    export { clazz as class };
</script>

<div class="space-y-2 {clazz}">
    <a
        class="text-center text-sm block"
        href="https://www.instagram.com/keevnx/"
        target="_blank">App by @keevnx</a
    >
    <a
        class="text-center text-sm block fill-current"
        href="https://github.com/vnxx/mangaku/"
        target="_blank"
    >
        <div class="flex items-center justify-center">
            <IcnGitHub />
            <span class="pl-2">github.com/vnxx/mangaku</span>
        </div>
    </a>

    <a
        class="text-center text-sm block fill-current"
        href="https://www.instagram.com/keevnx/"
        target="_blank"
    >
        <div class="flex items-center justify-center">
            <IcnInstagram />
            <span class="pl-2">instagram.com/keevnx</span>
        </div>
    </a>
</div>
