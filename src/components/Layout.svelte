<script>
    export let px = 3;
    export let spaceY = 3;
</script>

<div
    class={`max-w-5xl m-auto px-${px} space-y-${spaceY} py-3 relative text-white`}
>
    <slot />
</div>
