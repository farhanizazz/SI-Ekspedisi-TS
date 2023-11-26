<script>
    export let text;
    export let bgColor;
    export let textColor;
    export let onClick;
</script>

<button
  on:click={onClick}
  class="flex justify-center items-center m-1 px-2 py-1 rounded-full bg-orange-200 text-base outline-none focus:outline-none mb-1 ease-linear transition-all duration-150 border-none"
  style={`background-color: ${bgColor}; color: ${textColor};`}
>
  <div class="flex-initial max-w-full leading-none text-xs font-semibold">
    {text}
  </div>
</button>
