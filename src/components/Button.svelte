<script>
    let clazz;
    export let onclick = null;
    export let type = "button";
    export { clazz as class };
    export let theme = "secondary";
    export let size = "md";

    let sizes = {
        xs: "px-2 py-1 text-xs",
        sm: "px-3 py-2 text-sm",
        md: "px-4 py-2 text-md",
        lg: "px-4 py-2 text-lg",
        xl: "px-6 py-3 text-xl",
    };

    let colorThemes = {
        secondary: "text-white bg-secondary hover:bg-secondary-hover",
        red: "text-white bg-main-red hover:bg-main-red-hover",
    };
</script>

<button
    {type}
    on:click={onclick}
    class={`flex justify-center w-full items-center font-semibold rounded-lg transition-all duration-300 ease-in-out 
    ${sizes[size]} ${colorThemes[theme]} ${clazz}`}><slot /></button
>
