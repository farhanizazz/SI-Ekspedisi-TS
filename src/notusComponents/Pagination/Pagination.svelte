<script>
  export let onPrev;
  export let onNext;
  export let pageCount;
  export let onSeek;

  let currentPage = 0;
</script>

<div class="py-2">
  <nav class="block">
    <ul class="flex pl-0 rounded list-none flex-wrap">
      <li>
        <button
          on:click={() => {
            onPrev();
            if(currentPage > 0) currentPage -= 1;
          }}
          class="first:ml-0 text-xs font-semibold flex w-8 h-8 mx-1 p-0 rounded-full items-center justify-center leading-tight relative border border-solid border-orange-500 bg-white text-orange-500"
        >
          <i class="fas fa-chevron-left -ml-px"></i>
        </button>
      </li>
      {#each Array(pageCount) as _, i}
        <li>
          <button
            on:click={() => {
              onSeek(i);
              currentPage = i;
            }}
            class={currentPage == i
              ? "first:ml-0 text-xs font-semibold flex w-8 h-8 mx-1 p-0 rounded-full items-center justify-center leading-tight relative border border-solid border-orange-500 text-white bg-orange-500"
              : "first:ml-0 text-xs font-semibold flex w-8 h-8 mx-1 p-0 rounded-full items-center justify-center leading-tight relative border border-solid border-orange-500 bg-white text-orange-500"}
          >
            {i + 1}
          </button>
        </li>
      {/each}
      <!-- <li>
          <a href="#pablo" class="first:ml-0 text-xs font-semibold flex w-8 h-8 mx-1 p-0 rounded-full items-center justify-center leading-tight relative border border-solid border-orange-500 bg-white text-orange-500">
            1
          </a>
        </li>
        <li>
          <a href="#pablo" class="first:ml-0 text-xs font-semibold flex w-8 h-8 mx-1 p-0 rounded-full items-center justify-center leading-tight relative border border-solid border-orange-500 bg-white text-orange-500">
            2
          </a>
        </li>
        <li>
          <a href="#pablo" class="first:ml-0 text-xs font-semibold flex w-8 h-8 mx-1 p-0 rounded-full items-center justify-center leading-tight relative border border-solid border-orange-500 bg-white text-orange-500">
            3
          </a>
        </li>
        <li>
          <a href="#pablo" class="first:ml-0 text-xs font-semibold flex w-8 h-8 mx-1 p-0 rounded-full items-center justify-center leading-tight relative border border-solid border-orange-500 bg-white text-orange-500">
            4
          </a>
        </li>
        <li>
          <a href="#pablo" class="first:ml-0 text-xs font-semibold flex w-8 h-8 mx-1 p-0 rounded-full items-center justify-center leading-tight relative border border-solid border-orange-500 bg-white text-orange-500">
            5
          </a>
        </li> -->
      <li>
        <button
          on:click={() => {
            onNext();
            if(currentPage < pageCount - 1) currentPage += 1;
          }}
          class="first:ml-0 text-xs font-semibold flex w-8 h-8 mx-1 p-0 rounded-full items-center justify-center leading-tight relative border border-solid border-orange-500 bg-white text-orange-500"
        >
          <i class="fas fa-chevron-right -mr-px"></i>
        </button>
      </li>
    </ul>
  </nav>
</div>
